import request from 'supertest';
import { expect } from '@jest/globals';
import express, { Request, Response } from 'express';
import { comment_router } from '../routes/comments'; // Adjust the path accordingly
import rmp from '../controllers/RateMyProfessor';
import * as mongoUtils from '../utils/mongoUtils';
import ProfessorModel, { IProfessor } from '../models/professor';
import { Types } from 'mongoose';

// Mock dependencies
jest.mock('../controllers/RateMyProfessor');
jest.mock('../utils/mongoUtils');

// Mock comment controllers
// Mock functions or services used in your routes
jest.mock('../controllers/comments', () => ({
  createComment: jest.fn(),
  deleteCommentById: jest.fn(),
}));

const app = express();
app.use('/comments', comment_router);

describe('Comment Router', () => {
  it('should retrieve comments for a professor', async () => {
    // Mocking data for the professor ID
    const prof_id = 'mocked_prof_id';

    // Mock the searchById function
    const mockSearchById = jest.spyOn(mongoUtils, 'searchById');
    const mockProfessor: any = {
      _id: prof_id,
      name: 'Mock Professor',
      // Other properties of the Professor document...
    };
    mockSearchById.mockResolvedValue(mockProfessor);

    // Mock the searchTeacher function
    const mockSearchTeacher = jest.spyOn(rmp, 'searchTeacher');
    mockSearchTeacher.mockResolvedValue([
      {
        id: 'rmp_prof_id',
        firstName: 'Carl',
        lastName: 'McTague',
        school: { id: 'mock_school_id', name: 'Boston College' },
      },
    ]);

    // Mock the getTeacher function
    const mockGetTeacher = jest.spyOn(rmp, 'getTeacher');
    mockGetTeacher.mockResolvedValue({
      ratings: {
        edges: [
          {
            node: {
              class: 'Mock Course',
              comment: 'Mock Comment',
              date: '2024-01-27',
              wouldTakeAgain: true,
            },
          },
        ],
      },
    });

    // Mock findDocumentIdByFilter function
    const mockFindDocumentIdByFilter = jest.spyOn(
      mongoUtils,
      'findDocumentIdByFilter'
    );
    mockFindDocumentIdByFilter.mockResolvedValue(
      new Types.ObjectId('95677b3588c08c61f1964066')
    );

    const response = await request(app).get(`/comments/prof?id=${prof_id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        user_id: null,
        message: 'Mock Comment',
        createdAt: '2024-01-27T00:00:00.000Z',
        wouldTakeAgain: true,
        professor_id: prof_id,
        course_id: '95677b3588c08c61f1964066',
      },
    ]);

    // Check if the necessary functions were called with the expected arguments
    expect(mockSearchById).toHaveBeenCalledWith(ProfessorModel, prof_id);
    expect(mockSearchTeacher).toHaveBeenCalledWith(
      'Mock Professor',
      'U2Nob29sLTEyMg=='
    );
    expect(mockGetTeacher).toHaveBeenCalledWith('rmp_prof_id');
    expect(mockFindDocumentIdByFilter).toHaveBeenCalled(); // You may want to check the exact arguments depending on your use case
  });

  it('should handle missing professor ID', async () => {
    const response = await request(app).get('/comments/prof');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Query string must include id of professor');
  });
});

describe('Create Comment Route', () => {
  it('should create a new comment', async () => {
    // Mock data for testing
    const mockComment = {
      user_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
      message: 'Test comment',
      wouldTakeAgain: true,
      prof_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
      course_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
    };

    const body = JSON.stringify(mockComment);

    // Mock the createComment function
    jest
      .requireMock('../controllers/comments')
      .createComment.mockResolvedValueOnce(mockComment);

    const response = await request(app)
      .post('/comments/prof')
      .send(body)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Comment created successfully' });
  });

  it('should handle validation errors', async () => {
    // Missing required field to trigger validation error
    const invalidComment = {
      user_id: 'validUserId',
      message: 'Test comment',
      wouldTakeAgain: true,
      prof_id: 'validProfId',
      // Missing course_id
    };

    const response = await request(app)
      .post('/comments/prof')
      .send(JSON.stringify(invalidComment))
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should handle server errors', async () => {
    // Mock data for testing
    const mockComment = {
      user_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
      message: 'Test comment',
      wouldTakeAgain: true,
      prof_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
      course_id: new Types.ObjectId('b5a1c3950498777b6004514f'),
    };

    const body = JSON.stringify(mockComment);

    // Mock the createComment function to throw an error
    jest
      .requireMock('../controllers/comments')
      .createComment.mockRejectedValueOnce(new Error('Test error'));

    const response = await request(app)
      .post('/comments/prof')
      .send(body)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Delete Comment Route', () => {
  it('should delete a comment by ID', async () => {
    // Mock data for testing
    const validCommentId = new Types.ObjectId('b5a1c3950498777b6004514f');

    // Mock the deleteCommentById function
    jest
      .requireMock('../controllers/comments')
      .deleteCommentById.mockResolvedValueOnce({
        /* mock deleted comment */
      });

    const response = await request(app).delete(
      `/comments/prof/${validCommentId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Comment deleted successfully' });
  });

  it('should handle validation errors', async () => {
    // Invalid comment ID to trigger validation error
    const invalidCommentId = 'invalidCommentId';

    const response = await request(app).delete(
      `/comments/prof/${invalidCommentId}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should handle not found error', async () => {
    // Mock the deleteCommentById function to return null (comment not found)
    jest
      .requireMock('../controllers/comments')
      .deleteCommentById.mockResolvedValueOnce(null);

    const nonexistentCommentId = new Types.ObjectId('b5a1c3950498777b6004514f');

    const response = await request(app).delete(
      `/comments/prof/${nonexistentCommentId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });

  it('should handle server errors', async () => {
    // Mock the deleteCommentById function to throw an error
    jest
      .requireMock('../controllers/comments')
      .deleteCommentById.mockRejectedValueOnce(new Error('Test error'));

    const validCommentId = new Types.ObjectId('b5a1c3950498777b6004514f');

    const response = await request(app).delete(
      `/comments/prof/${validCommentId}`
    );

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error');
  });
});
