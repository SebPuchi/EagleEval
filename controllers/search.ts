import CourseModel from '../models/course';
import ProfessorModel from '../models/professor';

interface AutocompleteSearchResult {
  _id: string;
  title: string;
  crs_code?: string;
  score: { $meta: 'searchScore' };
}

// Autocomplete search for courses
export async function autocompleteCourseSearch(
  query: string
): Promise<AutocompleteSearchResult[]> {
  const agg: any[] = [
    {
      $search: {
        index: 'searchCourses',
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'title',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              autocomplete: {
                query: query,
                path: 'crs_code',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 1, maxExpansions: 256 },
              },
            },
            {
              text: {
                query: query,
                path: ['title', 'crs_code'],
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 1,
        title: 1,
        crs_code: 1,
        score: { $meta: 'searchScore' },
      },
    },
  ];

  return await CourseModel.aggregate<AutocompleteSearchResult>(agg);
}

// Autocomplete search for professors
export async function autocompleteProfSearch(
  query: string
): Promise<AutocompleteSearchResult[]> {
  const agg: any[] = [
    {
      $search: {
        index: 'searchProfs',
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'title',
                tokenOrder: 'any',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
            {
              text: {
                query: query,
                path: 'title',
                fuzzy: { maxEdits: 1, prefixLength: 0, maxExpansions: 50 },
              },
            },
          ],
        },
      },
    },
    {
      $limit: 5,
    },
    {
      $project: { _id: 1, title: 1, score: { $meta: 'searchScore' } },
    },
  ];

  return await ProfessorModel.aggregate<AutocompleteSearchResult>(agg);
}
