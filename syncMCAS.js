// Import the necessary modules
import fetch from "node-fetch";
import cheerio from "cheerio";

// Define the constant for the class name of the department div
const DEP_CLASS = "tab-pane tab-departments active ";
const PROF_CLASS = "faultySectionResult";

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
  parsedURL.pathname = parsedURL.pathname + "/people.html";

  // Serialize the updated URL back to a string
  const updatedURL = parsedURL.toString();

  return updatedURL;
}

// Gets prof data for a given department url
async function getProfData(depUrl) {
  // Get raw html from website
  const rawHTML = await getHtmlPage(depUrl);

  const profDiv = findDivByClassName(rawHTML, PROF_CLASS);

  return profDiv;
}

export async function getAllProfData() {
  var profData = [];

  // Scrape departments from BC website
  const deps = await getMcasDeps();

  for (const dep of deps) {
    console.log(`Fetching prof data for MCAS ${dep.department}`);
    let peopleURL = appendPathToURL(dep.url);
    console.log(peopleURL);
    let profDiv = await getProfData(peopleURL);
    profData += profDiv;
  }

  return profData;
}

// Main function to get the JSON representation of department information
export async function getMcasDeps() {
  var combinedLists = "";

  const pageURL =
    "https://www.bc.edu/bc-web/schools/morrissey/department-list.html";

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
