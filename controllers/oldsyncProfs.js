// Import the necessary modules
import fetch from "node-fetch";
import cheerio from "cheerio";

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

function getDivKeysWithImagePaths(html) {
  const $ = cheerio.load(html); // Load the HTML content

  const imagePaths = {};

  // Find all the <div> elements with a "data-imagepath" attribute
  $("div[data-imagepath]").each((index, element) => {
    const $div = $(element);
    const firstName = $div.attr("data-first-name").trim();
    const lastName = $div.attr("data-last-name").trim();
    const imagePath = $div.attr("data-imagepath");

    // Combine firstName and lastName to create the key
    const key = firstName + " " + lastName;
    // Set the key-value pair in the dictionary
    imagePaths[key] = imagePath;
  });

  return imagePaths;
}

function addKeysToObjects(jsonArray, keysToAdd) {
  const resultArray = jsonArray.map((obj, index) => {
    const firstName = obj["jcr:content"]["firstName"];
    const lastName = obj["jcr:content"]["lastName"];

    if (typeof obj !== "object" || !obj) {
      throw new Error(`Element at index ${index} is not a valid JSON object.`);
    }
    if (keysToAdd[firstName.trim() + " " + lastName.trim()] == undefined) {
      console.error(
        "ERROR!!! getting image for" + firstName.trim() + " " + lastName.trim()
      );
    }

    const newObj = { ...obj }; // Create a shallow copy of the original object
    const newImageObj = {
      profileImage: {
        fileReference: keysToAdd[firstName.trim() + " " + lastName.trim()],
      },
    };
    newObj["jcr:content"] = {
      ...newObj["jcr:content"],
      ...newImageObj,
    }; // Add a new key to the object
    return newObj;
  });

  return resultArray;
}

function appendPathToURL(inputPath, postfix) {
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
  parsedURL.pathname = parsedURL.pathname + postfix;

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

  // Add CS and CHEMISTRY
  depJSON.push({
    department: "CS",
    url: "https://www.bc.edu/bc-web/schools/morrissey/departments/computer-science.html",
  });
  depJSON.push({
    department: "CHEMISTRY",
    url: "https://www.bc.edu/bc-web/schools/morrissey/departments/chemistry.html",
  });

  return depJSON;
}

//
// Functions to get prof data for each school
//

// Gets prof data for a given department url
export async function getProfData(depUrl) {
  try {
    // Get JSON from the URL
    let response = await fetch(depUrl);

    if (response.status === 404) {
      console.error("Error: 404 Not Found ", depUrl);
      return [];
    }

    if (!response.ok) {
      // Handle other non-404 errors here if needed
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    let rawProfJson = await response.json();
    const cleanProfJson = [cleanProfData(rawProfJson)];

    return cleanProfJson;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return [];
  }
}

export async function getSSWProfData(depUrl) {
  const imgPage =
    "https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-expertise/jcr:content/facultyList/faculty-list.items.html";
  // get json prof data
  let profJson = await getProfData(depUrl);

  // get images from html page
  let rawHTML = await getHtmlPage(imgPage);
  let people = findDivByClassName(rawHTML, "hide");

  let images = getDivKeysWithImagePaths(people);

  return [addKeysToObjects(profJson[0], images)];
}

export async function getCSOMProfData(depUrl) {
  const imgPage =
    "https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-expertise/jcr:content/facultyList/faculty-list.items.html";
  // get json prof data
  let profJson = await getProfData(depUrl);

  // get images from html page
  let rawHTML = await getHtmlPage(imgPage);
  let people = findDivByClassName(rawHTML, "hide");

  let images = getDivKeysWithImagePaths(people);

  return [addKeysToObjects(profJson[0], images)];
}

export async function getMcasProfData(deaprtmentsUrl) {
  try {
    // Scrape departments from BC website
    const deps = await getMcasDeps(deaprtmentsUrl);

    const allProfData = deps.map(async (dep) => {
      let prof_data = [];

      console.log(`Fetching prof data for MCAS ${dep.department}`);
      let peopleURL = appendPathToURL(dep.url, "/people.4.json");

      let response = await fetch(peopleURL);
      // Check for wrong json path
      if (response.status === 300) {
        console.log("Changing to 3 json for: ", dep.url);
        peopleURL = appendPathToURL(dep.url, "/people.3.json");
        response = await fetch(peopleURL);
      } else if (response.status === 404) {
        console.error("Error: 404 Not Found ", dep.url);
        return [];
      } else if (!response.ok) {
        // Handle other non-404 errors here if needed
        console.error(`Error: ${response.status} ${response.statusText}`);
        return [];
      }
      const rawData = await response.json();

      const cleanJson = cleanProfData(rawData);

      for (const category in cleanJson) {
        const curr_cat_data = cleanProfData(cleanJson[category]);
        prof_data = prof_data.concat(curr_cat_data);
      }

      // Add old fauclty method
      let facultyURL = appendPathToURL(
        dep.url,
        "/people/faculty-directory.4.json"
      );
      let faculty = await fetch(facultyURL);
      if (faculty.status === 300) {
        console.log("Changing to faculty 3 json for: ", dep.url);
        facultyURL = appendPathToURL(
          dep.url,
          "/people/faculty-directory.3.json"
        );
        faculty = await fetch(facultyURL);
      } else if (faculty.status === 404) {
        console.error("Error: 404 Not Found ", dep.url);
        return [];
      } else if (!faculty.ok) {
        // Handle other non-404 errors here if needed
        console.error(`Error: ${faculty.status} ${faculty.statusText}`);
        return [];
      }
      const rawFaculty = await faculty.json();
      const cleanFaculty = cleanProfData(rawFaculty);

      prof_data = prof_data.concat(cleanFaculty);

      return [prof_data];
    });

    return Promise.all(allProfData);
  } catch (error) {
    console.error("Error getting MCAS profs:", error);
    throw error;
  }
}
