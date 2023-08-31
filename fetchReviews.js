/*
Fetch course review data from past BC course evaluations 
*/
import fetch from 'node-fetch'

// Parse HTML table element to JSON array of objects
const parseHTMLTableElem = (tableEl) => {
    const columns = Array.from(tableEl.querySelectorAll('th')).map(it => it.textContent)
    const rows = tableEl.querySelectorAll('tbody > tr')
    return Array.from(rows).map(row => {
        const cells = Array.from(row.querySelectorAll('td'))
        return columns.reduce((obj, col, idx) => {
            obj[col] = cells[idx].textContent
            return obj
        }, {})
    })
}

// Generate body for POST request to avalanche blue
const genBody = (query) => {
    body = {
        "strUiCultureIn":"en",
        "datasourceId":"560",
        "blockId":"30",
        "subjectValue":"____[-1]____",
        "detailValue":"____[-1]____",
        "gridId":"fbvGrid",
        "pageActuelle":1,
        "strOrderBy":["col_2","asc"],
        "strFilter":["",query,"ddlFbvColumnSelectorLvl1",""],
        // set pageSize to 1000 to get all in one page
        "sortCallbackFunc":"__getFbvGrid","userid":"","pageSize":"1000"
    }
    return JSON.stringify(body)
}

// fetch reviews from BC avalanche blue api. Parse output and get json of review data
const getReviews = async (query) => {
    const response = await fetch('https://avalanche.bc.edu/BPI/fbview-WebService.asmx/getFbvGrid', {
        method: 'post',
        body: genBody(query),
        headers: {'Content-Type': 'application/json'}
    });

    const rawData = await response.json();

    htmlTable = rawData["d"][0]

    return parseHTMLTableElem(htmlTable)
}
