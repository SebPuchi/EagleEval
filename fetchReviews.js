/*
  Fetch course review data from past BC (Boston College) course evaluations.
*/

// Import the 'node-fetch' library for making HTTP requests.
import fetch from "node-fetch";
// Import to convert html table to json
import HtmlTableToJson from "html-table-to-json";
// Import cheerio to parser html table
import cheerio from "cheerio";

// Function to generate the request body for the POST request to Avalanche Blue.
const genBody = (query) => {
  // Define the request body as a JavaScript object.
  var body = {
    strUiCultureIn: "en",
    datasourceId: "560",
    blockId: "30",
    subjectColId: "2",
    subjectValue: "____[-1]____",
    detailValue: "____[-1]____",
    gridId: "fbvGrid",
    pageActuelle: 1,
    strOrderBy: ["col_2", "asc"],
    strFilter: ["", query, "ddlFbvColumnSelectorLvl1", ""],
    sortCallbackFunc: "__getFbvGrid",
    userid: "",
    pageSize: "1000",
  };
  // Convert the body object to a JSON string.
  return JSON.stringify(body);
};

const cleanKeysAndRemoveNonASCII = (inputArray) => {
  return inputArray.map((jsonObject) => {
    const cleanedObject = {};
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        const cleanedKey = key
          .replace(/[^\x00-\x7F]+/g, "") // Remove non-ASCII characters
          .replace(/\s+/g, "") // Remove white spaces
          .toLowerCase(); // Convert to lowercase
        cleanedObject[cleanedKey] = jsonObject[key];
      }
    }
    return cleanedObject;
  });
};

const removeKeysFromArray = (arr, keysToRemove) => {
  // Use the map method to create a new array with the specified keys removed
  const newArray = arr.map((obj) => {
    // Create a copy of the original object to avoid modifying it directly
    const newObj = { ...obj };

    // Loop through the list of keys to remove
    keysToRemove.forEach((key) => {
      // Check if the key exists in the object before removing it
      if (newObj.hasOwnProperty(key)) {
        delete newObj[key];
      }
    });

    return newObj;
  });

  return newArray;
};

// Get id and sk for each row in table from reviews api
const extractIdAndSkAttributesFromHTML = (html) => {
  const $ = cheerio.load(html);
  const tuples = [];
  // Find all <tr> elements within the table
  $("table tr").each((index, row) => {
    // Get the 'id' and 'sk' attributes of the current <tr> element
    const id = $(row).attr("id");
    const sk = $(row).attr("sk");
    // Remove non-integer characters from the 'id' attribute using regular expression
    const cleanedId = id ? id.replace(/\D/g, "") : null;
    // If either 'cleanedId' or 'sk' attribute is present in the row, add it to the 'tuples' array as a tuple
    if (cleanedId || sk) {
      tuples.push([cleanedId, sk]);
    }
  });
  // Return the array of tuples containing 'cleanedId' and 'sk' attributes
  return tuples;
};

// Async function to fetch reviews from the BC Avalanche Blue API, parse the response, and return review data as JSON.
export const getReviews = async (query) => {
  // Data values to exclude in output
  const uneeded_keys = [
    "dpt_ins_overall",
    "dpt_crs_overall",
    "ratio",
    "modality effectiveness",
  ];

  // Send a POST request to the specified URL with the generated request body and headers.
  const response = await fetch(
    "https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid",
    {
      method: "post",
      body: genBody(query),
      headers: { "Content-Type": "application/json; charset=UTF-8" },
    }
  );

  // Parse the JSON response from the API.
  const rawData = await response.json();

  // Extract the HTML table data from the response.
  const reviews_json = HtmlTableToJson.parse(String(rawData["d"][0]));

  // Extract id and sk from html table. Used later for drill down data
  const row_ids = extractIdAndSkAttributesFromHTML(String(rawData["d"][0]));
  console.log(row_ids);

  // Remove uneeded keys in json
  let json_objects = reviews_json.results[0];
  let filtered_json = removeKeysFromArray(json_objects, uneeded_keys);

  // Clean JSON keys
  let result = cleanKeysAndRemoveNonASCII(filtered_json);

  return result;
};
