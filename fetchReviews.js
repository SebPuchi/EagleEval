/*
  Fetch course review data from past BC (Boston College) course evaluations.
*/

// Import the 'node-fetch' library for making HTTP requests.
import fetch from 'node-fetch'

// Function to parse an HTML table element into a JSON array of objects.
const parseHTMLTableElem = (tableEl) => {
    // Extract column names from table headers and convert them into an array.
    const columns = Array.from(tableEl.querySelectorAll('th')).map(it => it.textContent)
    // Extract table rows from the table body.
    const rows = tableEl.querySelectorAll('tbody > tr')
    // Convert the rows and columns into an array of objects (JSON).
    return Array.from(rows).map(row => {
        const cells = Array.from(row.querySelectorAll('td'))
        // Map each cell value to its corresponding column name to create objects.
        return columns.reduce((obj, col, idx) => {
            obj[col] = cells[idx].textContent
            return obj
        }, {})
    })
}

// Function to generate the request body for the POST request to Avalanche Blue.
const genBody = (query) => {
    // Define the request body as a JavaScript object.
    body = {
        "strUiCultureIn": "en",
        "datasourceId": "560",
        "blockId": "30",
        "subjectValue": "____[-1]____",
        "detailValue": "____[-1]____",
        "gridId": "fbvGrid",
        "pageActuelle": 1,
        "strOrderBy": ["col_2", "asc"],
        "strFilter": ["", query, "ddlFbvColumnSelectorLvl1", ""],
        // Set pageSize to 1000 to retrieve all data in a single page.
        "sortCallbackFunc": "__getFbvGrid",
        "userid": "",
        "pageSize": "1000"
    }
    // Convert the body object to a JSON string.
    return JSON.stringify(body)
}

// Async function to fetch reviews from the BC Avalanche Blue API, parse the response, and return review data as JSON.
const getReviews = async (query) => {
    // Send a POST request to the specified URL with the generated request body and headers.
    const response = await fetch('https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid', {
        method: 'post',
        body: genBody(query),
        headers: {'Content-Type': 'application/json'}
    });

    // Parse the JSON response from the API.
    const rawData = await response.json();

    // Extract the HTML table data from the response.
    htmlTable = rawData["d"][0]

    // Parse the HTML table data into a JSON array of objects (reviews).
    return parseHTMLTableElem(htmlTable)
}

module.exports = {
    getReviews
}
