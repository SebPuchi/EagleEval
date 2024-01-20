/*
 Utils used when fetching data to clean and filter the response
*/

/**
 * Cleans keys and removes non-ASCII characters from an array of JSON objects.
 *
 * @param {any[]} inputArray - The array of JSON objects to clean.
 * @returns {any[]} - A new array of cleaned JSON objects.
 */
export const cleanKeysAndRemoveNonASCII = (inputArray: any[]): any => {
  return inputArray.map((jsonObject) => {
    const cleanedObject: { [key: string]: any } = {};
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        const cleanedKey = key
          .replace(/[^\x00-\x7F]+/g, '') // Remove non-ASCII characters
          .replace(/\s+/g, '') // Remove white spaces
          .toLowerCase(); // Convert to lowercase
        cleanedObject[cleanedKey] = jsonObject[key];
      }
    }
    return cleanedObject;
  });
};

/**
 * Removes specified keys from each object in an array.
 *
 * @param {any[]} arr - The array of objects from which to remove keys.
 * @param {string[]} keysToRemove - The array of keys to remove from each object.
 * @returns {any[]} - A new array of objects with specified keys removed.
 */
export const removeKeysFromArray = (
  arr: any[],
  keysToRemove: string[]
): any => {
  // Use the map method to create a new array with the specified keys removed
  const newArray = arr.map((obj) => {
    // Create a copy of the original object to avoid modifying it directly
    const newObj: { [key: string]: any } = { ...obj };

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

/**
 * Removes duplicate objects from an array.
 *
 * @param {any[]} arr - The array of objects to remove duplicates from.
 * @returns {any[]} - A new array with duplicate objects removed.
 */
export const removeDuplicateObjects = (arr: any[]): any => {
  const uniqueObjects: any[] = [];
  const seenObjects = new Set<string>();

  for (const obj of arr) {
    const objString = JSON.stringify(obj);
    if (!seenObjects.has(objString)) {
      uniqueObjects.push(obj);
      seenObjects.add(objString);
    }
  }

  return uniqueObjects;
};

export function checkAndSetUndefinedIfString(value: any): string | undefined {
  return isNaN(Number(value)) ? undefined : value;
}
