// Update or insert new data
export async function updateCollection(colData, colModel, updateFunc) {
  try {
    // count of new course added
    var newItems = 0;

    var promises = [];
    // loop through each semester
    for (const item of colData) {
      // loop through courses in semester
      for (const obj of item) {
        let newDoc = updateFunc(colModel, obj);

        promises.push(newDoc);
      }
    }

    return newItems;
  } catch (error) {
    throw new Error(`Error updating collection data: ${error}`);
  }
}
