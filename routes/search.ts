// Search.ts - Router for autocomplete search
import express, { Request, Response } from 'express';

import {
  AutocompleteSearchResult,
  autocompleteCourseSearch,
  autocompleteProfSearch,
} from '../controllers/search';

export const search_router = express.Router();

search_router.get('/search/profs', async (req: Request, res: Response) => {
  try {
    // Get prof name as query paramter
    const query = (req.query['name'] as string) || null;

    if (query) {
      const search_results: AutocompleteSearchResult[] =
        await autocompleteProfSearch(query);

      console.log(`Found search results for ${query}`);

      return res.json(search_results);
    } else {
      return res.send('Query paramter "name" must not be empoty');
    }
  } catch (error) {
    console.log(`Error searching for prof: ${error}`);
    return res.send('Error searching for professor');
  }
});
