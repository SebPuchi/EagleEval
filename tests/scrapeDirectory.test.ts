import convertHtmlToJson from '../controllers/directory/scrape';
import html from './testDirPage.html';

describe('convertHtmlToJson', () => {
  test('it should parse table and list HTML into JSON objects', () => {
    const rawHtml = html;

    const { tableData, listData } = convertHtmlToJson(rawHtml);

    // Replace these assertions with the expected values based on your sample HTML
    expect(tableData).toEqual([
      {
        name: 'Donald Brady',
        roles: [
          'Part Time Faculty, Undergraduate Programs, Woods College of Adv. Std',
          'Part Time Faculty, Office of the Provost and Dean of Faculties',
        ],
        phone: '(617) 552-3900',
        photoUrl: 'https://agora.bc.edu/photos/bcids/56/urGFpFdcR58W8l26.jpg',
        link: 'main/personalPresence!displayInput.action?id=UJ1arQ52mL&tabIndexNumber=1&peopleSearch=&deptSearch=csom&groupEmailSearch=&peopleSearchSelect=BC+Community&clientInformation=&peopleSearchFilter=BC+Community',
      },
      // Add more entries as needed
    ]);

    expect(listData).toEqual({
      departments: [
        {
          name: 'BC Beyond',
          link: 'main/departmentPresence!displayInput.action?departmentNumber=050181&tabIndexNumber=1&peopleSearch=&deptSearch=csom&groupEmailSearch=&peopleSearchSelect=BC+Community&clientInformation=&peopleSearchFilter=BC+Community',
        },
        // Add more entries as needed
      ],
    });
  });

  test('it should exclude entries with all empty values', () => {
    const rawHtml = `
      <tr>
        <th scope="row" class="text-nowrap">
          <!-- Empty values -->
        </th>
        <td headers="title"></td>
        <td headers="phone"></td>
      </tr>
      <li role="listitem">
        <a href="#">Empty Entry</a>
      </li>
    `;

    const { tableData, listData } = convertHtmlToJson(rawHtml);

    expect(tableData).toEqual([]);
    expect(listData).toEqual({ departments: [] });
  });

  // Add more test cases for different scenarios as needed
});
