import fetch from "node-fetch";
import cheerio from "cheerio";
// Import to convert html table to json
import HtmlTableToJson from "html-table-to-json";

const DEP_CLASS = "tab-pane tab-departments active ";

async function getHtmlPage(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the HTML page. Status: ${response.status}`
      );
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

function findDivByClassName(html, className) {
  const $ = cheerio.load(html);

  function searchForDiv(element) {
    if (element.hasClass(className)) {
      return element;
    }

    let result = null;

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

  const div = searchForDiv($("body"));
  return div ? div.html() : null;
}

function extractUlElements(html) {
  const $ = cheerio.load(html);
  const lists = [];

  $("ul").each((index, element) => {
    lists.push($.html(element));
  });

  return lists;
}

function unorderedListToJson(html) {
  const $ = cheerio.load(html);
  const json = [];

  $("ul").each((index, ulElement) => {
    $(ulElement)
      .find("li")
      .each((index, liElement) => {
        const li = $(liElement);
        const text = li.text();
        const href = li.find("a").attr("href"); // Get the href attribute value

        json.push({ text, href });
      });
  });

  return json;
}

export async function getMcasDeps() {
  var combinedLists = "";

  const pageURL =
    "https://www.bc.edu/bc-web/schools/morrissey/department-list.html";

  // Get MACS html page
  let rawHTML = await getHtmlPage(pageURL);

  // Extract the dive of departments
  let departments = findDivByClassName(rawHTML, DEP_CLASS);

  // Get list of department page urls
  let depURLS = extractUlElements(departments);

  // concat all department lists
  for (const depList of depURLS) {
    combinedLists += String(depList);
  }

  let depJSON = unorderedListToJson(combinedLists);

  return depJSON;
}
