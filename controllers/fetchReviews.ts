import fetch from 'node-fetch';
import HtmlTableToJson from '../utils/HtmlTableToJson';
import {
  removeKeysFromArray,
  cleanKeysAndRemoveNonASCII,
} from '../utils/fetchUtils';
import { raw } from 'body-parser';

interface ReviewBody {
  strUiCultureIn: string;
  datasourceId: string;
  blockId: string;
  subjectColId: string;
  subjectValue: string;
  detailValue: string;
  gridId: string;
  pageActuelle: number;
  strOrderBy: [string, 'asc' | 'desc'];
  strFilter: [string, string, string, string];
  sortCallbackFunc: string;
  userid: string;
  pageSize: string;
}

// Function to generate the request body for the POST request to Avalanche Blue.
const genBody = (query: string): string => {
  // Define the request body as a TypeScript object.
  let body: ReviewBody = {
    strUiCultureIn: 'en',
    datasourceId: '560',
    blockId: '30',
    subjectColId: '2',
    subjectValue: '____[-1]____',
    detailValue: '____[-1]____',
    gridId: 'fbvGrid',
    pageActuelle: 1,
    strOrderBy: ['col_2', 'asc'],
    strFilter: ['', query, 'ddlFbvColumnSelectorLvl1', ''],
    sortCallbackFunc: '__getFbvGrid',
    userid: '',
    pageSize: '1000',
  };
  // Convert the body object to a JSON string.
  return JSON.stringify(body);
};

// Async function to fetch reviews from the BC Avalanche Blue API, parse the response, and return review data as JSON.
export const getReviews = async (query: string): Promise<any> => {
  // Data values to exclude in output
  const uneeded_keys: string[] = [
    'dpt_ins_overall',
    'dpt_crs_overall',
    'ratio',
    'modality',
    'modalityeffectiveness',
  ];

  // Send a POST request to the specified URL with the generated request body and headers.
  const response = await fetch(
    'https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid',
    {
      method: 'post',
      body: genBody(query),
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
    console.log('No reviews found for ' + query);
    return null;
  }

  // Clean JSON keys
  let clean_json = cleanKeysAndRemoveNonASCII(json_objects);

  // Remove uneeded keys in json
  let result = removeKeysFromArray(clean_json, uneeded_keys);

  return result;
};
