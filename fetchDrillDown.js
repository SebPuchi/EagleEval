/*
 Fetch more detailed data for each review entry
*/

import HtmlTableToJson from "html-table-to-json";
import fetch from "node-fetch";
// Import fetch utils
import {
  removeKeysFromArray,
  cleanKeysAndRemoveNonASCII,
} from "./fetchUtils.js";

const genBody = (code, instructor) => {
  let body = {
    strUiCultureIn: "en",
    datasourceId: "670",
    blockId: "30",
    subjectColId: "2",
    subjectValue: code,
    detailValue: instructor,
    gridId: "fbvGridDrilldown",
    pageActuelle: 1,
    strOrderBy: ["col_19", "desc", code, instructor],
    strFilter: ["", "", "ddlFbvColumnSelector", ""],
    sortCallbackFunc: "__getFbvGridDrilldownData",
    userid: "",
    pageSize: "1000",
  };

  // Convert the body object to a JSON string.
  return JSON.stringify(body);
};

export const getDrillDown = async (code, instructor) => {
  // Data values to exclude in output
  const uneeded_keys = [
    "learningobjectivesclear(c)",
    "effectivecreatingunderstandingofdifficultsubjectmatter/practices(i)",
    "instructorreturnedassignments(i)",
    "timelyfeedback(i)",
    "meaningfulfeedback(i)",
    "seminaraworthwhileexperience(i)",
    "seminarasamethodtoadvisefreshmen(i)",
    "asanacademicadvisor(i)",
    "asacourseinstructor(i)",
    "readingsanddiscussionswereinterestinganduseful(i)",
    "waytolearnaboutclassmates(i)",
    "learningapplicablebeyondcourse(c)",
    "motivatedmetodomybestwork(i)",
    "instructorenthusiastic(i)",
    "coursefollowedsyllabus(c)",
    "instructorrespectfulofstudents(i)",
    "workrequired(c)",
    "courseoverall(c)",
    "instructoroverall(i)",
  ];

  // Send a POST request to the specified URL with the generated request body and headers.
  const response = await fetch(
    "https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid",
    {
      method: "post",
      body: genBody(code, instructor),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  );

  // Parse the JSON response from the API.
  const rawData = await response.json();

  // Extract the HTML table data from the response.
  const reviews_json = HtmlTableToJson.parse(String(rawData["d"][0]));
  let json_objects = reviews_json.results[0];

  // Clean JSON keys
  let clean_json = cleanKeysAndRemoveNonASCII(json_objects);

  // Remove uneeded keys in json

  let result = removeKeysFromArray(clean_json, uneeded_keys);

  return result;
};
