import Group from './group';
import fillAndSubmitForm from './auth';
import convertHtmlToJson, { ListData } from './scrape';
import { IProfessor } from '../../models/professor';

/**
 * Builds a tree structure representing a directory of groups and members.
 *
 * @param {string} rootUrl - The URL of the root group in the directory.
 * @param {string} name - The name of the root group.
 * @param {number} depth - The current layer of the tree (default = 0)
 * @returns {Promise<Group>} - The root of the tree structure representing the directory.
 */
async function buildTree(
  rootUrl: string,
  name: string,
  depth: number = 0
): Promise<Group> {
  // Create root group
  let root = new Group(name);

  // Get data for the root group from the directory
  const rootHTML: string[] = await fillAndSubmitForm(rootUrl);

  let allListData: ListData = { departments: [] };

  for (const page of rootHTML) {
    // Parse HTML into JSON objects of group members and owned groups
    const { tableData, listData } = convertHtmlToJson(page);

    // Add child groups to list
    allListData = listData;

    for (const tableEntry of tableData) {
      const newProf: IProfessor = <IProfessor>{
        name: tableEntry.name,
        title: tableEntry.roles,
        phone: tableEntry.phone,
        photoLink: tableEntry.photoUrl,
      };
      root.addMember(newProf);
    }
  }
  // Print currrent layer of tree
  root.print(depth);

  // Recursively fill the tree
  for (const listItem of allListData.departments) {
    root.addSubgroup(await buildTree(listItem.link, listItem.name, depth + 1));
  }

  return root;
}

export default buildTree;
