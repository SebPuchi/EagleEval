// Converts a course json object to a mongodb Document
function courseJSONToDoc(courseJSON) {
  // Converts json to format of schema
  let courseData = {
    title: courseJSON.title,
    college: courseJSON.college,
    crs_desc: courseJSON.crs_desc,
    subject: courseJSON.subject,
    crs_id: {
      dept_code: courseJSON.dept_code,
      crs_number: parseInt(courseJSON.crs_number),
    },
  };

  return courseData;
}

// Converts a professor json object to a mongodb Document
function profJSONtoDoc(profJson) {
  // Convert json to format of schema
  let profData = {
    title: profJson["jcr:content"]["jcr:title"],
    firstName: profJson["jcr:content"]["firstName"],
    lastName: profJson["jcr:content"]["lastName"],
    office: profJson["jcr:content"]["office"],
    education: profJson["jcr:content"]["education"],
    email: profJson["jcr:content"]["email"],
    phone: profJson["jcr:content"]["phone"],
    profileImage: profJson["jcr:content"]["profileImage"]["fileReference"],
  };

  return profData;
}

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

export async function findOrCreateAndUpdateCourse(courseModel, crsJSON) {
  try {
    // create doc from course JSON for update
    const crsObject = courseJSONToDoc(crsJSON);

    // Define a query to find the user by a unique identifier (e.g., course id)
    const query = { crs_id: crsObject.crs_id };

    // Create an options object to specify that we want to upsert (insert if not found)
    const options = {
      upsert: true,
      setDefaultsOnInsert: true,
      includeResultMetadata: true,
    };

    // Use findOneAndReplace to find and replace or insert the document
    const updatedCourse = await courseModel.findOneAndUpdate(
      query,
      crsObject,
      options
    );

    if (updatedCourse.lastErrorObject.updatedExisting) {
      console.log(
        `Updating: ${crsObject.crs_id.dept_code + crsObject.crs_id.crs_number}`
      );
      return false;
    } else {
      console.log(
        `Adding new course: ${
          crsObject.crs_id.dept_code + crsObject.crs_id.crs_number
        }`
      );
      return true;
    }
  } catch (error) {
    throw new Error(`Error finding or creating course: ${error}`);
  }
}

export async function findOrCreateAndUpdateProf(profModel, profJSON) {
  try {
    // creat doc form json
    const profDoc = profJSONtoDoc(profJSON);

    // query for search
    const query = { title: profDoc.title };

    // Create an options object to specify that we want to upsert (insert if not found)
    const options = {
      upsert: true,
      setDefaultsOnInsert: true,
      includeResultMetadata: true,
    };

    // Use findOneAndReplace to find and replace or insert the document
    const updatedProf = await profModel.findOneAndUpdate(
      query,
      profDoc,
      options
    );

    if (updatedProf.lastErrorObject.updatedExisting) {
      console.log(`Updating: ${profDoc.title}`);
      return false;
    } else {
      console.log(`Adding new professor: ${profDoc.title}`);
      return true;
    }
  } catch (error) {
    throw new Error(`Error finding or creating professor: ${error}`);
  }
}
