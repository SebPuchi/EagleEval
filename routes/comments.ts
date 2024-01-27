import express, { Request, Response } from 'express';
import rmp from 'controllers/RateMyProfessor';

const BC_SCHOOL_ID = 'U2Nob29sLTEyMg==';

const comment_router = express.Router();

//send comments for a prof
comment_router.get('/prof', async (req: Request, res: Response) => {
  const prof_name = req.query['name'] as any | null;

  if (prof_name) {
    console.log(`Searching RMP for comments on ${prof_name}`);

    const prof_id: string = (
      await rmp.searchTeacher(prof_name, BC_SCHOOL_ID)
    )[0].id;

    if (prof_id) {
      const comments: any = await rmp.getTeacher(prof_id);

      return res.json(comments.ratings.edges);
    } else {
      console.log(`${prof_name} not found in RMP`);
      return res.json(null);
    }
  } else {
    return res.send('Query string must include name of professor');
  }
});

export { comment_router };
