import express, { Request, Response } from 'express';
import {
  searchForTeacher,
  getTeacherReviews,
} from 'controllers/RateMyProfessor';

const comment_router = express.Router();

//send comments for a prof
comment_router.get('/prof', async (req: Request, res: Response) => {
  const prof_name = req.query['name'] as any | null;

  if (prof_name) {
    console.log(`Searching RMP for comments for ${prof_name}`);

    const prof_id: string | null = await searchForTeacher(prof_name);
    if (prof_id) {
      const comments = await getTeacherReviews(prof_id);

      return res.json(comments);
    } else {
      console.log(`${prof_name} not found in RMP`);
      return res.json(null);
    }
  } else {
    return res.send('Query string must include name of professor');
  }
});

export { comment_router };
