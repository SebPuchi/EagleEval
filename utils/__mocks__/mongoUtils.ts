// __mocks__/mongoUtils.ts
import { Types, Document, Model } from 'mongoose';
import * as constants from '../../tests/constants';

export const searchForId = jest.fn(
  async <T extends Document, P extends keyof T>(
    id: string,
    model: Model<T>,
    parameter: P
  ): Promise<T[] | null> => {
    try {
      // Verify if the provided ID is a valid ObjectId
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ObjectId');
      }

      // Mock results
      const mockResult: T[] = [{ _id: id } as T]; // Adjust the mock data as needed

      return mockResult;
    } catch (error) {
      // Handle errors, you might want to log the error or perform some other action
      console.error('Mocked Error searching by ID:', error);
      throw error;
    }
  }
);

export const searchById = jest.fn(
  async <T extends Document>(
    model: Model<T>,
    id: Types.ObjectId
  ): Promise<T | null> => {
    if (!Types.ObjectId.isValid(id)) {
      console.error('Mocked Invalid ID: ', id);
      return null;
    }

    // Mock result
    const mockResult: T | null = {
      _id: id,
      user_id: constants.VALID_USER_ID,
    } as any; // Adjust the mock data as needed

    return mockResult;
  }
);
