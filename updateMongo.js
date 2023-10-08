// Update or insert new data
export async function updateCollection(colData, colModel, updateFunc) {
  try {
    // count of new course added
    var newItems = 0;

    // loop through each semester
    for (const item of colData) {
      // loop through courses in semester
      for (const obj of item) {
        let newDoc = await updateFunc(colModel, obj);

        // Add to new courses count
        if (newDoc) {
          newItems += 1;
        }
      }
    }

    return newItems;
  } catch (error) {
    throw new Error(`Error updating collection data for ${colModel}: ${error}`);
  }
}
