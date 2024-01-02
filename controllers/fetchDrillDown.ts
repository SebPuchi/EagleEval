import HtmlTableToJson from '../utils/HtmlTableToJson';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
// Import fetch utils
import {
  removeKeysFromArray,
  cleanKeysAndRemoveNonASCII,
} from '../utils/fetchUtils';
import { IDrilldown } from '../models/drilldown';
import ReviewMode, { IReview } from '../models/review';
import CourseModel, { ICourse } from '../models/course';
import ProfessorModel, { IProfessor } from '../models/professor';
import { searchById } from '../utils/mongoUtils';
import ReviewModel from '../models/review';

interface RequestBody {
  strUiCultureIn: string;
  datasourceId: string;
  blockId: string;
  subjectColId: string;
  subjectValue: string;
  detailValue: string;
  gridId: string;
  pageActuelle: number;
  strOrderBy: [string, string, string, string];
  strFilter: [string, string, string, string];
  sortCallbackFunc: string;
  userid: string;
  pageSize: string;
}

/**
 * Generates the request body for the API call.
 *
 * @param code - The code parameter.
 * @param instructor - The instructor parameter.
 * @returns A JSON string representing the request body.
 */
const genBody = (code: string, instructor: string): string => {
  const body: RequestBody = {
    strUiCultureIn: 'en',
    datasourceId: '670',
    blockId: '30',
    subjectColId: '2',
    subjectValue: code,
    detailValue: instructor,
    gridId: 'fbvGridDrilldown',
    pageActuelle: 1,
    strOrderBy: ['col_19', 'desc', code, instructor],
    strFilter: ['', '', 'ddlFbvColumnSelector', ''],
    sortCallbackFunc: '__getFbvGridDrilldownData',
    userid: '',
    pageSize: '1000',
  };

  // Convert the body object to a JSON string.
  return JSON.stringify(body);
};

/**
 * Retrieves more detailed data for each review entry.
 *
 * @param review_id - The id of the parent review document.
 * @returns A Promise that resolves to the detailed data or null if no data is found.
 */
export const getDrillDown = async (
  review_id: Types.ObjectId
): Promise<IDrilldown | null> => {
  // Get search parames from mongo docs
  const parent_review: IReview | null = await searchById(
    ReviewModel,
    review_id
  );

  if (parent_review) {
    var semester: string = parent_review.semester;
    const prof: IProfessor | null = await searchById(
      ProfessorModel,
      parent_review.professor_id
    );
    const course: ICourse | null = await searchById(
      CourseModel,
      parent_review.course_id
    );
    if (prof && course) {
      var code: string = course.code;
      var instructor: string = prof.name;
    } else {
      console.log('Parent review does not have prof and course id set');
      return null;
    }
  } else {
    console.log('Review id not found when getting drilldown for ' + review_id);
    return null;
  }
  // Data values to exclude in output
  const uneeded_keys: string[] = [
    'learningobjectivesclear(c)',
    'effectivecreatingunderstandingofdifficultsubjectmatter/practices(i)',
    'instructorreturnedassignments(i)',
    'timelyfeedback(i)',
    'meaningfulfeedback(i)',
    // ... (remaining keys)
  ];

  // Send a POST request to the specified URL with the generated request body and headers.
  const response = await fetch(
    'https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid',
    {
      method: 'post',
      body: genBody(code, instructor),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    }
  );

  // Parse the JSON response from the API.
  const rawData: any = await response.json();

  // Extract the HTML table data from the response.
  const reviews_json = HtmlTableToJson.parse(String(rawData['d'][0]));
  let json_objects = reviews_json.results[0];

  // Check if no results are returned
  if (Object.keys(json_objects[0]).length <= 1) {
    console.log('No data found for ' + code + ' ' + instructor);
    return null;
  }

  // Clean JSON keys
  let clean_json = cleanKeysAndRemoveNonASCII(json_objects);

  // Remove uneeded keys in json
  let result = removeKeysFromArray(clean_json, uneeded_keys);

  let match = null;
  for (const document of result) {
    if (document.semester === semester) {
      match = document;
      match.review_id = review_id;
    }
  }

  if (!match) {
    return null;
  }

  return <IDrilldown>match;
};
