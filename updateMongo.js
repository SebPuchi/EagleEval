import { findOrCreateAndUpdateUser } from "./mongoUtils.js";

// Update or insert new data
export async function updateCourses(courseData, courseModel) {
  try {
    // count of new course added
    var newCourses = 0;

    // loop through each semester
    for (const semester of courseData) {
      // loop through courses in semester
      for (const course of semester) {
        let newCourse = await findOrCreateAndUpdateUser(courseModel, course);

        // Add to new courses count
        if (newCourse) {
          newCourses += 1;
        }
      }
    }

    return newCourses;
  } catch (error) {
    throw new Error(`Error updating course data: ${error}`);
  }
}
