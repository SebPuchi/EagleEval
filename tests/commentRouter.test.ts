import request from 'supertest';
import express, { Request, Response } from 'express';
import { comment_router } from '../routes/comments'; // Adjust the path accordingly
import rmp from '../controllers/RateMyProfessor';
import * as mongoUtils from '../utils/mongoUtils';
import ProfessorModel, { IProfessor } from '../models/professor';
import { Types } from 'mongoose';

// Mock dependencies
jest.mock('../controllers/RateMyProfessor');
jest.mock('../utils/mongoUtils');

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
