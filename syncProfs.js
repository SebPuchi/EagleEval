// Import the necessary modules
import fetch from "node-fetch";
import cheerio from "cheerio";
import { cleanKeysAndRemoveNonASCII } from "./fetchUtils.js";

// Define the constant for the class name of the department div
const DEP_CLASS = "tab-pane tab-departments active ";

// Function to fetch the HTML content of a web page given its URL
async function getHtmlPage(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the HTML page. Status: ${response.status}`
      );
    }

    // Read the HTML content from the response
    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

// Recursive function to find a div element by its class name in the HTML
function findDivByClassName(html, className) {
  const $ = cheerio.load(html);

  function searchForDiv(element) {
    if (element.hasClass(className)) {
      return element;
    }

    let result = null;

    // Recursively search through child elements
    element.children().each((index, childElement) => {
      const child = $(childElement);
      const found = searchForDiv(child);

      if (found) {
        result = found;
        return false; // Break out of the loop when a match is found
      }
    });

    return result;
  }

  // Start the search from the <body> element
  const div = searchForDiv($("body"));
  return div ? div.html() : null;
}

// Function to extract all <ul> elements from the HTML content
function extractUlElements(html) {
  const $ = cheerio.load(html);
  const lists = [];

  // Find all <ul> elements in the HTML
  $("ul").each((index, element) => {
    lists.push($.html(element)); // Add the HTML of each <ul> to the array
  });

  return lists;
}

// Function to convert <ul> elements to a JSON format
function unorderedListToJson(html) {
  const $ = cheerio.load(html);
  const json = [];

  // For each <ul> element, extract <li> items and convert to JSON
  $("ul").each((index, ulElement) => {
    $(ulElement)
      .find("li")
      .each((index, liElement) => {
        const li = $(liElement);
        const text = li.text(); // Get the text content of the <li>
        const href = li.find("a").attr("href"); // Get the href attribute value

        // Add the text and href to the JSON array
        json.push({ department: text, url: href });
      });
  });

  return json;
}

function appendPathToURL(inputPath) {
  if (!inputPath.startsWith("https://www.bc.edu")) {
    // Append "https://www.bc.edu/" to the front of the input string
    inputPath = `https://www.bc.edu${inputPath}`;
  }
  // Parse the URL string
  const parsedURL = new URL(inputPath);

  // Remove ".html" from the end of the pathname if it exists
  if (parsedURL.pathname.endsWith(".html")) {
    parsedURL.pathname = parsedURL.pathname.slice(0, -5);
  }

  // Append "people.html" to the pathname
  parsedURL.pathname = parsedURL.pathname + "/people/faculty-directory.3.json";

  // Serialize the updated URL back to a string
  const updatedURL = parsedURL.toString();

  return updatedURL;
}

function cleanProfData(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return non-objects or null as is
  }

  // Filter out keys starting with 'jcr:'
  const result = [];

  for (const key in obj) {
    if (!key.startsWith("jcr:")) {
      result.push(obj[key]);
    }
  }

  return result;
}

// Main function to get the JSON representation of department information
export async function getMcasDeps(pageURL) {
  var combinedLists = "";

  // Get MACS HTML page
  let rawHTML = await getHtmlPage(pageURL);

  // Extract the div of departments
  let departments = findDivByClassName(rawHTML, DEP_CLASS);

  // Get a list of department page URLs
  let depURLs = extractUlElements(departments);

  // Concatenate all department lists into a single string
  for (const depList of depURLs) {
    combinedLists += String(depList);
  }

  // Convert the concatenated list to JSON format
  let depJSON = unorderedListToJson(combinedLists);

  return depJSON;
}

//
// Functions to get prof data for each school
//

// Gets prof data for a given department url
export async function getProfData(depUrl) {
  // Get json from url
  let response = await fetch(depUrl);
  let rawProfJson = await response.json();

  const cleanProfJson = [
    cleanKeysAndRemoveNonASCII(cleanProfData(rawProfJson)),
  ];

  return cleanProfJson;
}

export async function getMcasProfData(deaprtmentsUrl) {
  try {
    // Scrape departments from BC website
    const deps = await getMcasDeps(deaprtmentsUrl);

    const promises = deps.map((dep) => {
      console.log(`Fetching prof data for MCAS ${dep.department}`);
      const peopleURL = appendPathToURL(dep.url);
      return getProfData(peopleURL);
    });

    return Promise.all(promises);
  } catch (error) {
    console.error("Error getting MCAS profs:", error);
    throw error;
  }
}
