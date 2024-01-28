import express, { Request, Response } from 'express';
import ProfessorModel from '../models/professor';
import { searchById, findDocumentIdByFilter } from '../utils/mongoUtils';
import { Types } from 'mongoose';
import rmp from '../controllers/RateMyProfessor';
import { IComment } from '../models/comment';
import CourseModel from '../models/course';

const BC_SCHOOL_ID = 'U2Nob29sLTEyMg==';

const comment_router = express.Router();

async function convertToIComment(
  jsonData: any[],
  prof_id: Types.ObjectId
): Promise<IComment[]> {
  const convertedData: IComment[] = await Promise.all(
    jsonData.map(async (item) => {
      const commentNode = item.node;

      const filter = {
        code: {
          $regex: new RegExp(commentNode.class, 'i'),
        },
      };

      const course_id = await findDocumentIdByFilter(CourseModel, filter);
      return <any>{
        user_id: null,
        message: commentNode.comment,
        createdAt: new Date(commentNode.date),
        wouldTakeAgain: commentNode.wouldTakeAgain ? true : false,
        professor_id: prof_id, // You should replace this with the actual professor_id
        course_id: course_id, // You should replace this with the actual course_id
      };
    })
  );

  return convertedData;
}

// Router endpoint for retrieving comments for a professor
comment_router.get('/prof', async (req: Request, res: Response) => {
  // Extract professor id from the query string
  const prof_id: any = req.query['id'];

  if (prof_id) {
    // Retrieve professor name from MongoDB using the provided professor id
    const prof_name = (
      await searchById(ProfessorModel, <Types.ObjectId>prof_id)
    )?.name;

    if (prof_name) {
      // Log the intention to search RMP for comments on the professor
      console.log(`Searching RMP for comments on ${prof_name}`);

      // Search RMP for the professor's information and get RMP professor id
      const rmp_prof_id: string = (
        await rmp.searchTeacher(prof_name, BC_SCHOOL_ID)
      )[0]?.id;

      if (rmp_prof_id) {
        // Retrieve comments from RMP using the RMP professor id
        const comments: any = await rmp.getTeacher(rmp_prof_id);

        // Convert RMP comments to the desired format
        const convertedComments = await convertToIComment(
          comments.ratings.edges,
          prof_id
        );

        // Send the converted comments as JSON response
        return res.json(convertedComments);
      } else {
        // Log that the professor was not found in RMP
        console.log(`${prof_name} not found in RMP`);
        return res.json(null);
      }
    } else {
      // Log that the provided professor id does not exist in MongoDB
      console.log('Invalid prof id, does not exist in MongoDB');
      return res.json(null);
    }
  } else {
    // Return an error message if the professor id is not provided in the query string
    return res.send('Query string must include id of professor');
  }
});

export { comment_router };
