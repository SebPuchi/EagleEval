import Group from './group';
import { IProfessor } from '../../models/professor';

interface TableData {
  name: string;
  roles: string[];
  phone: string;
  photoUrl: string;
  link: string;
}

interface ListData {
  departments: { name: string; link: string }[];
}

function convertHtmlToJson(rawHtml: string): {
  tableData: TableData[];
  listData: ListData;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Extract table data
  const tableRows = doc.querySelectorAll('tr');
  const tableData: TableData[] = [];

  tableRows.forEach((row) => {
    const name = row.querySelector('.bc-mugshot a')?.textContent || '';
    const roles: string[] = [];
    const roleElements = row.querySelectorAll('td[headers="title"] div');
    roleElements.forEach((roleElement) => {
      roles.push(roleElement.textContent || '');
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
    const name = listItem.textContent || '';
    const link = listItem.getAttribute('href') || '';
    // Check if all values are empty before adding to the array
    if (name || link) {
      departments.push({ name, link });
    }
  });

  const listData: ListData = { departments };

  return { tableData, listData };
}

export default convertHtmlToJson;
