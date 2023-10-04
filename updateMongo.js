import { courseJSONToModel, findOrCreateAndUpdateUser } from "./mongoUtils";

// Update or insert new data
export async function updateCourses(courseData, courseModel) {
  try {
    // loop through each semester
    for (const semester of courseData) {
      // loop through courses in semester
      for (const course of semester) {
        let crsDoc = courseJSONToModel(courseModel, course);
        await findOrCreateAndUpdateUser(courseModel, crsDoc);
      }
    }
  } catch (error) {
    throw new Error(`Error updating course data: ${error}`);
  }
}
