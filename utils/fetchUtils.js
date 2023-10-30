/*
 Utils used when fetching data to clean and filter the response
*/

export const cleanKeysAndRemoveNonASCII = (inputArray) => {
  return inputArray.map((jsonObject) => {
    const cleanedObject = {};
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        const cleanedKey = key
          //.replace(/[^\x00-\x7F]+/g, "") // Remove non-ASCII characters
          .replace(/\s+/g, "") // Remove white spaces
          .toLowerCase(); // Convert to lowercase
        cleanedObject[cleanedKey] = jsonObject[key];
      }
    }
    return cleanedObject;
  });
};

export const removeKeysFromArray = (arr, keysToRemove) => {
  // Use the map method to create a new array with the specified keys removed
  const newArray = arr.map((obj) => {
    // Create a copy of the original object to avoid modifying it directly
    const newObj = { ...obj };

    // Loop through the list of keys to remove
    keysToRemove.forEach((key) => {
      // Check if the key exists in the object before removing it
      if (newObj.hasOwnProperty(key)) {
        delete newObj[key];
      }
    });

    return newObj;
  });

  return newArray;
};

export const removeDuplicateObjects = (arr) => {
  const uniqueObjects = [];
  const seenObjects = new Set();

  for (const obj of arr) {
    const objString = JSON.stringify(obj);
    if (!seenObjects.has(objString)) {
      uniqueObjects.push(obj);
      seenObjects.add(objString);
    }
  }

  return uniqueObjects;
};
