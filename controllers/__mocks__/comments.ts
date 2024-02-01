// __mocks__/commentUtils.ts

import CommentModel, { IComment } from '../../models/comment';
import { Types } from 'mongoose';
import * as constants from '../../tests/constants';

export const cleanAndCheckComment = jest.fn(
  (userComment: string): string | undefined => {
    if (userComment.length <= 300) {
      let cleanedComment = userComment.trim();
      cleanedComment = cleanedComment.replace(/<\/?[^>]+(>|$)/g, '');

      const injectionPatterns = [
        /script/gi,
        /on\w*=/gi,
        /javascript:/gi,
        /(<\s*\/?\s*script\s*>)/gi,
      ];
      for (const pattern of injectionPatterns) {
        cleanedComment = cleanedComment.replace(pattern, '');
      }
      return cleanedComment;
    } else {
      return undefined;
    }
  }
);

export const createComment = jest.fn(
  (
    user_id: Types.ObjectId,
    message: string,
    wouldTakeAgain: boolean,
    prof_id: Types.ObjectId,
    course_id: Types.ObjectId
  ): Promise<IComment | null> => {
    const new_comment: IComment = <any>{
      user_id: user_id,
      message: cleanAndCheckComment(message),
      wouldTakeAgain: wouldTakeAgain,
      professor_id: prof_id,
      course_id: course_id,
    };

    return Promise.resolve(new_comment);
  }
);

export const deleteCommentById = jest.fn(
  async (objectId: Types.ObjectId): Promise<IComment | null> => {
    try {
      const result: IComment = <any>{
        user_id: constants.VALID_USER_ID,
        message: 'Test comment',
        wouldTakeAgain: true,
        prof_id: new Types.ObjectId('82493b0b18c55ace59aa4825'),
        course_id: new Types.ObjectId('82493b0b18c55ace59aa4825'),
      };
      if (objectId != constants.INVALID_COMMENT_ID) {
        console.log(`Comment with ID ${objectId} deleted successfully.`);
        return result;
      } else {
        console.log(`Comment with ID ${objectId} not found.`);
        return null;
      }
    } catch (error) {
      console.error(`Error deleting document with ID ${objectId}: ${error}`);
      return null;
    }
  }
);
