import Group from './group';
import fillAndSubmitForm from './auth';
import convertHtmlToJson from './scrape';
import { IProfessor } from '../../models/professor';

/**
 * Builds a tree structure representing a directory of groups and members.
 *
 * @param {string} rootUrl - The URL of the root group in the directory.
 * @param {string} name - The name of the root group.
 * @returns {Group} - The root of the tree structure representing the directory.
 */
function buildTree(rootUrl: string, name: string): Group {
  // Create root group
  let root = new Group(name);

  // Get data for the root group from the directory
  const rootHTMLPromise: Promise<string> = fillAndSubmitForm(rootUrl);
  rootHTMLPromise
    .then((rootHTML) => {
      // Parse HTML into JSON objects of group members and owned groups
      const { tableData, listData } = convertHtmlToJson(rootHTML);

      for (const tableEntry of tableData) {
        const newProf: IProfessor = <IProfessor>{
          name: tableEntry.name,
          title: tableEntry.roles,
          phone: tableEntry.phone,
          photoLink: tableEntry.photoUrl,
        };
        root.addMember(newProf);
      }

      // Recursively fill the tree
      for (const listItem of listData.departments) {
        root.addSubgroup(buildTree(listItem.link, listItem.name));
      }
    })
    .catch((error) => {
      console.log('Promise rejected with error: ' + error);
    });

  return root;
}

export default buildTree;
