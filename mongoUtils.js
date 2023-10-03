import mongoose from "mongoose";

// Function to check if a document with a specific key exists
export async function courseExsists(courseModel, keyToCheck) {
  try {
    // Use the findOne method to find a document that matches the key
    const document = await courseModel.findOne({ keyToCheck }).exec();

    // If a document is found, it exists
    if (document) {
      console.log(`Document with course id "${keyToCheck}" exists.`);
      return true;
    } else {
      console.log(`Document with course id "${keyToCheck}" does not exist.`);
      return false;
    }
  } catch (err) {
    console.error("Error checking document:", err);
    return false; // Handle the error as needed
  }
}

// Converts a course json object to a mongodb Model
export async function courseJSONToModel(courseModel, courseJSON) {
  // Converts json to format of schema
  courseData = {
    title: courseJSON.title,
    college: courseJSON.college,
    crs_desc: courseJSON.crs_desc,
    subject: courseJSON.subject,
    crs_id: {
      crs_number: parseInt(courseJSON.crs_number),
      dept_code: courseJSON.dept_code,
    },
  };

  // return model of data from json
  const course = await new courseModel(courseData);
  return course;
}
