import express, { Request, Response } from 'express';
import supertest from 'supertest';
import { search_router } from '../routes/search';
import {
  autocompleteCourseSearch,
  autocompleteProfSearch,
} from '../controllers/search';

jest.mock('../controllers/search', () => ({
  autocompleteCourseSearch: jest.fn(),
  autocompleteProfSearch: jest.fn(),
}));

const mockedAutocompleteCourseSearch =
  autocompleteCourseSearch as jest.MockedFunction<
    typeof autocompleteCourseSearch
  >;
const mockedAutocompleteProfSearch =
  autocompleteProfSearch as jest.MockedFunction<typeof autocompleteProfSearch>;

describe('Search Router', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use('/search', search_router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /search/profs', () => {
    it('should handle professor search', async () => {
      const query = 'John Doe';
      mockedAutocompleteProfSearch.mockResolvedValueOnce([
        { _id: '123456789', name: 'Carl McTague', score: 4.3 },
      ]);
      const response = await supertest(app).get(`/search/profs?name=${query}`);

      expect(mockedAutocompleteProfSearch).toHaveBeenCalledWith(query);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { _id: '123456789', name: 'Carl McTague', score: 4.3 },
      ]);
    });

    it('should handle empty professor search query', async () => {
      const response = await supertest(app).get('/search/profs');

      expect(response.status).toBe(200);
      expect(response.text).toContain(
        'Query parameter "name" must not be empty for professor'
      );
    });

    it('should handle professor search errors', async () => {
      const query = 'John Doe';
      mockedAutocompleteProfSearch.mockRejectedValueOnce('Some error');
      const response = await supertest(app).get(`/search/profs?name=${query}`);

      expect(mockedAutocompleteProfSearch).toHaveBeenCalledWith(query);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error searching for professor');
    });
  });

  describe('GET /search/courses', () => {
    it('should handle course search', async () => {
      const query = 'Computer Science';
      mockedAutocompleteCourseSearch.mockResolvedValueOnce([
        {
          _id: '123456789',
          title: 'Logic and Comp',
          code: 'CSCI2243',
          score: 4.3,
        },
      ]);
      const response = await supertest(app).get(
        `/search/courses?name=${query}`
      );

      expect(mockedAutocompleteCourseSearch).toHaveBeenCalledWith(query);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: '123456789',
          title: 'Logic and Comp',
          code: 'CSCI2243',
          score: 4.3,
        },
      ]);
    });

    it('should handle empty course search query', async () => {
      const response = await supertest(app).get('/search/courses');

      expect(response.status).toBe(200);
      expect(response.text).toContain(
        'Query parameter "name" must not be empty for course'
      );
    });

    it('should handle course search errors', async () => {
      const query = 'Computer Science';
      mockedAutocompleteCourseSearch.mockRejectedValueOnce('Some error');
      const response = await supertest(app).get(
        `/search/courses?name=${query}`
      );

      expect(mockedAutocompleteCourseSearch).toHaveBeenCalledWith(query);
      expect(response.status).toBe(200);
      expect(response.text).toContain('Error searching for course');
    });
  });
});
