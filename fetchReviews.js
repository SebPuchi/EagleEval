/*
  Fetch course review data from past BC (Boston College) course evaluations.
*/

// Import the 'node-fetch' library for making HTTP requests.
import fetch from 'node-fetch'
// Import to convert html table to json
import HtmlTableToJson from 'html-table-to-json'

// Function to generate the request body for the POST request to Avalanche Blue.
const genBody = (query) => {
    // Define the request body as a JavaScript object.
    var body = {
        "strUiCultureIn":"en",
        "datasourceId":"560",
        "blockId":"30",
        "subjectColId":"2",
        "subjectValue":"____[-1]____",
        "detailValue":"____[-1]____",
        "gridId":"fbvGrid","pageActuelle":1,
        "strOrderBy":["col_2","asc"],
        "strFilter":["",query,"ddlFbvColumnSelectorLvl1",""],
        "sortCallbackFunc":"__getFbvGrid",
        "userid":"","pageSize":"1000"
    }
    // Convert the body object to a JSON string.
    return JSON.stringify(body)
}

// Async function to fetch reviews from the BC Avalanche Blue API, parse the response, and return review data as JSON.
export const getReviews = async (query) => {
    // Send a POST request to the specified URL with the generated request body and headers.
    const response = await fetch('https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid', {
        method: 'post',
        body: genBody(query),
        headers: {'Content-Type': 'application/json; charset=UTF-8'}
    });
   
    // Parse the JSON response from the API.
    const rawData = await response.json();

    // Extract the HTML table data from the response.
    const reviews_json = HtmlTableToJson.parse(String(rawData["d"][0]))

    // Parse the HTML table data into a JSON array of objects (reviews).
    return reviews_json.results
    //return parseHTMLTableElem(htmlTable)
}
