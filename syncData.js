/*

Refresh course db with data from bc website

Fall - https://bcweb.bc.edu/aem/coursesfall.json
Summer - https://bcweb.bc.edu/aem/coursessumm.json
Spring - https://bcweb.bc.edu/aem/coursessprg.json

*/

import fetch from "node-fetch";
import { removeKeysFromArray } from "./fetchUtils";

var COURSE_DATA_URL = [
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

    const json = await JSON.parse(response.json());
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
  const uneeded_keys = ["comments", "xlist", "coreq", "open_close"];

  const new_json_data = fetchJsonsFromUrls(COURSE_DATA_URL);

  let parsed_json = new_json_data.map((json) =>
    removeKeysFromArray(json, uneeded_keys)
  );
}
