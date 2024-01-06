import { JSDOM } from 'jsdom';
import Group from './group';
import { IProfessor } from '../../models/professor';

/**
 * Converts raw HTML data into structured JSON objects representing table and list data.
 *
 * @param {string} rawHtml - The raw HTML data to be parsed.
 * @returns {{ tableData: TableData[]; listData: ListData }} - An object containing table and list data.
 */
export interface TableData {
  name: string;
  roles: string[];
  phone: string;
  photoUrl: string;
  link: string;
}

export interface ListData {
  departments: { name: string; link: string }[];
}

function convertHtmlToJson(rawHtml: string): {
  tableData: TableData[];
  listData: ListData;
} {
  const dom = new JSDOM(rawHtml);
  const window = dom.window;

  // Access the document and other DOM APIs
  const doc = window.document;

  // Extract table data
  const tableRows = doc.querySelectorAll('tr');
  const tableData: TableData[] = [];

  tableRows.forEach((row) => {
    const name = row.querySelector('.bc-mugshot a')?.textContent || '';
    const roles: string[] = [];
    const roleElements = row.querySelectorAll(
      'td[headers="title"] div[tabindex="0"]'
    );
    roleElements.forEach((roleElement) => {
      if (roleElement.textContent) {
        roles.push(roleElement.textContent.trim());
      }
    });
    const phone = row.querySelector('td[headers="phone"] a')?.textContent || '';
    const photoUrl =
      row.querySelector('.bc-pix img')?.getAttribute('src') || '';
    const link = row.querySelector('.bc-mugshot a')?.getAttribute('href') || '';

    // Check if all values are empty before adding to the array
    if (name || roles.length || phone || photoUrl || link) {
      const rowData: TableData = { name, roles, phone, photoUrl, link };
      tableData.push(rowData);
    }
  });

  // Extract list data
  const listItems = doc.querySelectorAll('li[role="listitem"] a');
  const departments: { name: string; link: string }[] = [];

  listItems.forEach((listItem) => {
    const path = listItem.getAttribute('href');

    const name = listItem.textContent || '';
    const link =
      path && path != '#'
        ? 'https://services.bc.edu/directorysearch/main/' + path
        : '';
    // Check if all values are empty before adding to the array
    if (name && link) {
      departments.push({ name, link });
    }
  });

  const listData: ListData = { departments };

  return { tableData, listData };
}

export default convertHtmlToJson;
