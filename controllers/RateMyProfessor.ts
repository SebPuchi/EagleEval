import ratings from '@chromeskullex/rate-my-professors';
/*
TypeError: ratings.searchSchool is not a function
    at file:///home/andrew/EagleEval/controllers/RateMyProfessor.ts:1:190
    at ModuleJob.run (node:internal/modules/esm/module_job:218:25)
    at async ModuleLoader.import (node:internal/modules/esm/loader:323:24)
    at async loadESM (node:internal/process/esm_loader:28:7)
    at async handleMainPromise (node:internal/modules/run_main:120:12)


*/
// Define the school ID for Boston College using the searchSchool method
console.log(ratings.searchSchool('Boston College'));
const BC_SCHOOL_ID = (await ratings.searchSchool('Boston College'))[0].id;

/**
 * Searches for a teacher by name and returns the teacher's ID.
 *
 * @param {string} name - The name of the teacher to search for.
 * @returns {Promise<string | null>} - The teacher's ID if found, otherwise null.
 */
export const searchForTeacher = async (
  name: string
): Promise<string | null> => {
  // Search for the teacher using the provided name and the school ID for Boston College
  const response = await ratings.searchTeacher(name, BC_SCHOOL_ID);

  // If a response is received and there is at least one result, return the first teacher's ID
  if (response && response.length > 0) {
    return response[0].id;
  }

  // Return null if no teacher is found
  return null;
};

/**
 * Retrieves the reviews for a teacher based on the provided teacher ID.
 *
 * @param {string} id - The ID of the teacher for whom reviews are to be retrieved.
 * @returns {Promise<any | null>} - The teacher's reviews if found, otherwise null.
 */
export const getTeacherReviews = async (id: string): Promise<any | null> => {
  // Retrieve the teacher's reviews using the getTeacher method
  const response = await ratings.getTeacher(id);

  // Return the response if available, otherwise return null
  return response ? response : null;
};
