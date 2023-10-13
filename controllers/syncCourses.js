/*

Refresh course db with data from bc website

Fall - https://bcweb.bc.edu/aem/coursesfall.json
Summer - https://bcweb.bc.edu/aem/coursessumm.json
Spring - https://bcweb.bc.edu/aem/coursessprg.json

*/

import fetch from "node-fetch";
import {
  removeKeysFromArray,
  removeDuplicateObjects,
} from "../utils/fetchUtils.js";

var COURSE_DATA_URLS = [
  "https://bcweb.bc.edu/aem/coursesfall.json",
  "https://bcweb.bc.edu/aem/coursessumm.json",
  "https://bcweb.bc.edu/aem/coursessprg.json",
];

// Sends get request to get json data
async function fetchJsonFromBC(url) {
  try {
    const response = await fetch(url);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Gets json from each url
async function fetchJsonsFromUrls(urlArray) {
  try {
    const promises = urlArray.map((url) => fetchJsonFromBC(url));
    const jsons = await Promise.all(promises);
    return jsons;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function processNewData() {
  const uneeded_keys = [
    "course_id",
    "comments",
    "xlist",
    "coreq",
    "open_close",
    "instructors",
    "room_schedule",
    "student_level",
    "section",
    "dept_name",
    "freq",
    "prereq",
    "term",
    "core_list",
    "credits",
  ];

  const new_json_data = fetchJsonsFromUrls(COURSE_DATA_URLS);

  var parsed_json = [];

  console.log("Getting coure data from BC site");

  await new_json_data.then((results) => {
    for (const result of results) {
      let clean_json = removeKeysFromArray(result.payload, uneeded_keys);
      let trimmed_json = removeDuplicateObjects(clean_json);
      parsed_json.push(trimmed_json);
    }
  });

  return parsed_json;
}
