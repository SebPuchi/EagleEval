import CommentModel, { IComment } from '../models/comment';
import { Types } from 'mongoose';

/**
 * Cleans and checks a user comment for potential issues like leading/trailing whitespaces,
 * HTML tags, and common injection attack patterns.
 *
 * @param userComment - The user's input comment.
 * @returns The cleaned comment, ensuring it is under 300 characters.
 */
function cleanAndCheckComment(userComment: string): string | undefined {
  // Check if the comment is under 300 characters
  if (userComment.length <= 300) {
    // Remove leading and trailing whitespaces
    let cleanedComment = userComment.trim();

    // Remove HTML tags (if any)
    cleanedComment = cleanedComment.replace(/<\/?[^>]+(>|$)/g, '');

    // Check for common injection attack patterns
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
    // If the comment is too long, return undefined
    return undefined;
  }
}

/**
 * Creates a new comment and returns the created comment.
 *
 * @param user_id - The ObjectId of the user creating the comment.
 * @param message - The user's comment message.
 * @param wouldTakeAgain - A boolean indicating whether the user would take the course again.
 * @param prof_id - The ObjectId of the professor associated with the comment.
 * @param course_id - The ObjectId of the course associated with the comment.
 * @returns A Promise resolving to the created comment or null if there was an error.
 */
export async function createComment(
  user_id: Types.ObjectId,
  message: string,
  wouldTakeAgain: boolean,
  prof_id: Types.ObjectId,
  course_id: Types.ObjectId
): Promise<IComment | null> {
  const clean_comment = cleanAndCheckComment(message);

  if (clean_comment) {
    const new_comment: IComment = <any>{
      user_id: user_id,
      message: clean_comment,
      wouldTakeAgain: wouldTakeAgain,
      professor_id: prof_id,
      course_id: course_id,
    };

    return CommentModel.create(new_comment);
  } else {
    return null;
  }
}

/**
 * Deletes a comment by its ObjectId and returns the deleted comment.
 *
 * @param objectId - The ObjectId of the comment to be deleted.
 * @returns A Promise resolving to the deleted comment or null if not found or there was an error.
 */
export async function deleteCommentById(
  objectId: Types.ObjectId
): Promise<IComment | null> {
  try {
    const result = await CommentModel.findByIdAndDelete(objectId);
    if (result) {
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
