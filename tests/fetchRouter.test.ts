import request from 'supertest';
import express, { Request, Response } from 'express';
import { fetch_router } from '../routes/fetch'; // Import the router from your file
import { getReviews } from '../controllers/fetchReviews';
import { getDrillDown } from '../controllers/fetchDrillDown';
import * as MongoUtils from '../utils/mongoUtils';

// Mock your controllers and models
jest.mock('../controllers/fetchReviews');
jest.mock('../controllers/fetchDrillDown');
jest.mock('../models/review');
jest.mock('../models/drilldown');
jest.mock('../models/professor');
jest.mock('../models/course');

describe('fetch_router', () => {
  const app = express();
  app.use(express.json());
  app.use('/', fetch_router);

  // Mock the functions inside the controllers
  const mockGetReviews = getReviews as jest.MockedFunction<typeof getReviews>;
  const mockGetDrillDown = getDrillDown as jest.MockedFunction<
    typeof getDrillDown
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reviews', () => {
    it('should return reviews when query is provided', async () => {
      mockGetReviews.mockResolvedValueOnce(<any[]>[
        {
          semester: 'Fall 2020',
          instructor_overall: '4.41',
          course_overall: '4.13',
          section: '01',
          professor_id: '65a2d05c70ab57d05e553e68',
          course_id: '6594510b07ba1e03a2d466a3',
          prof: 'Carl Mctague',
          code: 'CSCI224301',
        },
        {
          semester: 'Fall 2021',
          instructor_overall: '3.29',
          course_overall: '3.17',
          section: '01',
          professor_id: '65a2d05c70ab57d05e553e68',
          course_id: '6594510b07ba1e03a2d466a3',
          prof: 'Carl Mctague',
          code: 'CSCI224301',
        },
      ]);

      const response = await request(app).get('/reviews?search=query');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          semester: 'Fall 2020',
          instructor_overall: '4.41',
          course_overall: '4.13',
          section: '01',
          professor_id: '65a2d05c70ab57d05e553e68',
          course_id: '6594510b07ba1e03a2d466a3',
          prof: 'Carl Mctague',
          code: 'CSCI224301',
        },
        {
          semester: 'Fall 2021',
          instructor_overall: '3.29',
          course_overall: '3.17',
          section: '01',
          professor_id: '65a2d05c70ab57d05e553e68',
          course_id: '6594510b07ba1e03a2d466a3',
          prof: 'Carl Mctague',
          code: 'CSCI224301',
        },
      ]);
    });

    it('should return "No reviews found" when no reviews are found', async () => {
      mockGetReviews.mockResolvedValueOnce(null);

      const response = await request(app).get('/reviews?search=query');

      expect(response.status).toBe(200);
      expect(response.text).toBe('No reviews found');
    });

    // Add more test cases for different scenarios
  });

  describe('GET /drilldown', () => {
    it('should return drilldown data when reviewId is provided', async () => {
      mockGetDrillDown.mockResolvedValueOnce(<any>{
        _id: '65ac1716e1e7a1376235a797',
        review_id: '65ac10d3e1e7a137622216e2',
        __v: 0,
        assignmentshelpful: 4.17,
        attendancenecessary: 2.13,
        availableforhelpoutsideofclass: 3.5,
        courseintellectuallychallenging: 4.71,
        coursewellorganized: 3.92,
        effortavghoursweekly: 4,
        stimulatedinterestinthesubjectmatter: 3.88,
      });

      const response = await request(app).get(
        '/drilldown?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: '65ac1716e1e7a1376235a797',
        review_id: '65ac10d3e1e7a137622216e2',
        __v: 0,
        assignmentshelpful: 4.17,
        attendancenecessary: 2.13,
        availableforhelpoutsideofclass: 3.5,
        courseintellectuallychallenging: 4.71,
        coursewellorganized: 3.92,
        effortavghoursweekly: 4,
        stimulatedinterestinthesubjectmatter: 3.88,
      });
    });

    // Add more test cases for different scenarios
  });
  /*
  describe('GET /database/prof', () => {
    it('should return professor data when id is provided', async () => {
      const mockSearchForId = jest.spyOn(MongoUtils, 'searchForId');
      mockSearchForId.mockResolvedValueOnce(<any>[
        {
          _id: '65a2d05c70ab57d05e553e68',
          name: 'Carl McTague',
          __v: 0,
          education: [
            'B.A., Cincinnati Conservatory of Music',
            'Ph.D., Cambridge University',
          ],
          phone: '(617) 552-3975',
          title: ['Assistant Professor of the Practice, Computer Science'],
          email: 'carl.mctague@bc.edu',
          office: '245 Beacon Street 428D',
          photoLink:
            'https://bc.edu/content/dam/bc1/schools/mcas/Faculty Directory/Carl-McTague_350x418.jpg',
        },
      ]);

      const response = await request(app).get(
        '/database/prof?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: '65a2d05c70ab57d05e553e68',
        name: 'Carl McTague',
        __v: 0,
        education: [
          'B.A., Cincinnati Conservatory of Music',
          'Ph.D., Cambridge University',
        ],
        phone: '(617) 552-3975',
        title: ['Assistant Professor of the Practice, Computer Science'],
        email: 'carl.mctague@bc.edu',
        office: '245 Beacon Street 428D',
        photoLink:
          'https://bc.edu/content/dam/bc1/schools/mcas/Faculty Directory/Carl-McTague_350x418.jpg',
      });
    });

    it('should return "Query params must include "id"" when id is not provided', async () => {
      const response = await request(app).get('/database/prof');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query params must include "id"');
    });

    // Add more test cases for different scenarios
  });

  describe('GET /database/course', () => {
    it('should return course data when id is provided', async () => {
      const mockSearchForId = jest.spyOn(MongoUtils, 'searchForId');
      mockSearchForId.mockResolvedValueOnce(<any>[
        {
          _id: '6594510f07ba1e03a2d47689',
          code: 'THEO4001',
          __v: 0,
          college: 'MCAS',
          description:
            "This course will explore the narratives that emerged in the Lbgtiq+ community's protests in the streets demanding recognition of their identities and rights. These experiences gave way to political and spiritual thinking that imagines the person and society in new ways. We will also address spirituality, new forms of community and theological narratives that emerge from exclusion as political and spiritual resistance, reshaping the human condition from denied bodies.",
          subject: 'Theology',
          title: "Queer Theologies: Bodies that don't matter have the floor",
        },
      ]);

      const response = await request(app).get(
        '/database/course?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: '6594510f07ba1e03a2d47689',
        code: 'THEO4001',
        __v: 0,
        college: 'MCAS',
        description:
          "This course will explore the narratives that emerged in the Lbgtiq+ community's protests in the streets demanding recognition of their identities and rights. These experiences gave way to political and spiritual thinking that imagines the person and society in new ways. We will also address spirituality, new forms of community and theological narratives that emerge from exclusion as political and spiritual resistance, reshaping the human condition from denied bodies.",
        subject: 'Theology',
        title: "Queer Theologies: Bodies that don't matter have the floor",
      });
    });

    it('should return "Query params must include "id"" when id is not provided', async () => {
      const response = await request(app).get('/database/course');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query params must include "id"');
    });

    // Add more test cases for different scenarios
  });
  */
  describe('GET /database/review/prof', () => {
    it('should return reviews data when id is provided', async () => {
      const mockSearchForId = jest.spyOn(MongoUtils, 'searchForId');
      mockSearchForId.mockResolvedValueOnce(<any[]>[
        {
          _id: '65ac10d3e1e7a13762221673',
          code: 'CSCI224303',
          prof: 'Carl Mctague',
          semester: 'Fall 2022',
          __v: 0,
          course_id: '6594510b07ba1e03a2d466a3',
          course_overall: 3.57,
          instructor_overall: 3.48,
          professor_id: '65a2d05c70ab57d05e553e68',
          section: 3,
        },
        {
          _id: '65ac10d3e1e7a1376222166b',
          code: 'CSCI224301',
          prof: 'Carl Mctague',
          semester: 'Fall 2020',
          __v: 0,
          course_id: '6594510b07ba1e03a2d466a3',
          course_overall: 4.13,
          instructor_overall: 4.41,
          professor_id: '65a2d05c70ab57d05e553e68',
          section: 1,
        },
      ]);

      const response = await request(app).get(
        '/database/review/prof?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: '65ac10d3e1e7a13762221673',
          code: 'CSCI224303',
          prof: 'Carl Mctague',
          semester: 'Fall 2022',
          __v: 0,
          course_id: '6594510b07ba1e03a2d466a3',
          course_overall: 3.57,
          instructor_overall: 3.48,
          professor_id: '65a2d05c70ab57d05e553e68',
          section: 3,
        },
        {
          _id: '65ac10d3e1e7a1376222166b',
          code: 'CSCI224301',
          prof: 'Carl Mctague',
          semester: 'Fall 2020',
          __v: 0,
          course_id: '6594510b07ba1e03a2d466a3',
          course_overall: 4.13,
          instructor_overall: 4.41,
          professor_id: '65a2d05c70ab57d05e553e68',
          section: 1,
        },
      ]);
    });

    it('should return "Query params must include "id"" when id is not provided', async () => {
      const response = await request(app).get('/database/review/prof');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query params must include "id"');
    });

    // Add more test cases for different scenarios
  });

  describe('GET /database/review/course', () => {
    it('should return reviews data when id is provided', async () => {
      const mockSearchForId = jest.spyOn(MongoUtils, 'searchForId');
      mockSearchForId.mockResolvedValueOnce(<any[]>[
        {
          _id: '65ac116de1e7a13762240dea',
          code: 'THEO400101',
          prof: 'Carlos Mendoza-Alvarez',
          semester: 'Spring 2022',
          __v: 0,
          course_id: '6594510f07ba1e03a2d47689',
          course_overall: 4.67,
          instructor_overall: 5,
          professor_id: '65a2d06270ab57d05e55540f',
          section: 1,
        },
      ]);

      const response = await request(app).get(
        '/database/review/course?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: '65ac116de1e7a13762240dea',
          code: 'THEO400101',
          prof: 'Carlos Mendoza-Alvarez',
          semester: 'Spring 2022',
          __v: 0,
          course_id: '6594510f07ba1e03a2d47689',
          course_overall: 4.67,
          instructor_overall: 5,
          professor_id: '65a2d06270ab57d05e55540f',
          section: 1,
        },
      ]);
    });

    it('should return "Query params must include "id"" when id is not provided', async () => {
      const response = await request(app).get('/database/review/course');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query params must include "id"');
    });

    // Add more test cases for different scenarios
  });

  describe('GET /database/drilldown', () => {
    it('should return drilldown data when id is provided', async () => {
      const mockSearchForId = jest.spyOn(MongoUtils, 'searchForId');
      mockSearchForId.mockResolvedValueOnce(<any[]>[
        {
          _id: '65ac1716e1e7a1376235a797',
          review_id: '65ac10d3e1e7a137622216e2',
          __v: 0,
          assignmentshelpful: 4.17,
          attendancenecessary: 2.13,
          availableforhelpoutsideofclass: 3.5,
          courseintellectuallychallenging: 4.71,
          coursewellorganized: 3.92,
          effortavghoursweekly: 4,
          stimulatedinterestinthesubjectmatter: 3.88,
        },
      ]);

      const response = await request(app).get(
        '/database/drilldown?id=e4a68da8737e4d7d711cfab0'
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: '65ac1716e1e7a1376235a797',
          review_id: '65ac10d3e1e7a137622216e2',
          __v: 0,
          assignmentshelpful: 4.17,
          attendancenecessary: 2.13,
          availableforhelpoutsideofclass: 3.5,
          courseintellectuallychallenging: 4.71,
          coursewellorganized: 3.92,
          effortavghoursweekly: 4,
          stimulatedinterestinthesubjectmatter: 3.88,
        },
      ]);
    });

    it('should return "Query params must include "id"" when id is not provided', async () => {
      const response = await request(app).get('/database/drilldown');

      expect(response.status).toBe(200);
      expect(response.text).toBe('Query params must include "id"');
    });

    // Add more test cases for different scenarios
  });
});
