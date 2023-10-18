import { parse } from "dotenv";

function trimJsonValues(jsonObj) {
  if (typeof jsonObj !== "object") {
    throw new Error("Input must be a JSON object.");
  }

  for (const key in jsonObj) {
    if (jsonObj.hasOwnProperty(key) && typeof jsonObj[key] === "string") {
      jsonObj[key] = jsonObj[key].trim();
    }
  }

  return jsonObj;
}


// Converts a course json object to a mongodb Document
function courseJSONToDoc(courseJSON) {
  // Converts json to format of schema
  let courseData = {
    title: courseJSON.title,
    college: courseJSON.college,
    crs_desc: courseJSON.crs_desc,
    subject: courseJSON.subject,
    crs_code: courseJSON.dept_code + courseJSON.crs_number,
  };

  return courseData;
}

// Converts a professor json object to a mongodb Document
function profJSONtoDoc(profJson) {
  const profileContent = trimJsonValues(profJson["jcr:content"]);

  const imgFile = profileContent.hasOwnProperty("profileImage")
    ? profileContent["profileImage"]["fileReference"]
    : "/content/dam/bc1/schools/mcas/Faculty Directory/no-profile-image_335x400px.jpg";

  return {
    title: `${profileContent["firstName"]} ${profileContent["lastName"]}`,
    firstName: profileContent["firstName"],
    lastName: profileContent["lastName"],
    office: profileContent["office"],
    education: profileContent["education"],
    email: profileContent["email"],
    phone: profileContent["phone"],
    profileImage: imgFile,
  };
}

// Converts a reviews json from bc reviews to a mongodb doc
function reviewJsonToDoc(revJson) {
  const revData = {
    course_code: revJson.course_code,
    course_name: revJson.course_name,
    semester: revJson.semester,
    department: revJson.department,
    school: revJson.school,
    instructor: revJson.instructor,
    instructor_overall: revJson.instructor_overall,
    course_overall: revJson.course_overall,
  };

  return revData;
}

// Convert detailed drilldown data into a mongodb doc
function drilldownJsonToDoc(ddJson) {
  const ddData = {
    course_code: ddJson["course_code"],
    course_name: ddJson["course_name"],
    instructor: ddJson["instructor"],
    semester: ddJson["semester"],
    coursewellorganized: !isNaN(ddJson["coursewellorganized(c)"])
      ? ddJson["coursewellorganized(c)"]
      : undefined,
    courseintellectuallychallenging: !isNaN(
      ddJson["courseintellectuallychallanging(c)"]
    )
      ? ddJson["courseintellectuallychallanging(c)"]
      : undefined,
    effortavghoursweeklyc: !isNaN(ddJson["effortavghoursweeklyc"])
      ? ddJson["effortavghoursweeklyc"]
      : undefined,
    attendancenecessary: !isNaN(ddJson["attendancenecessary(c)"])
      ? ddJson["attendancenecessary(c)"]
      : undefined,
    assignmentshelpful: !isNaN(ddJson["assignmentshelpful(c)"])
      ? ddJson["assignmentshelpful(c)"]
      : undefined,
    instructorprepared: !isNaN(ddJson["instructorprepared(i)"])
      ? ddJson["instructorprepared(i)"]
      : undefined,
    instructorclearexplanations: !isNaN(
      ddJson["instructorclearexplanations(i)"]
    )
      ? ddJson["instructorclearexplanations(i)"]
      : undefined,
    availableforhelpoutsideofclass: !isNaN(
      ddJson["availableforhelpoutsideofclass(i)"]
    )
      ? ddJson["availableforhelpoutsideofclass(i)"]
      : undefined,
    stimulatedinterestinthesubjectmatter: !isNaN(
      ddJson["stimulatedinterestinthesubjectmatter(i)"]
    )
      ? ddJson["stimulatedinterestinthesubjectmatter(i)"]
      : undefined,
  };

  return ddData;
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

export async function searchReviews(model, query) {
  const pipeline = {
    $or: [
      { course_code: new RegExp(query) },
      { instructor: new RegExp(query, "i") },
    ],
  };

  return model.find(pipeline).exec();
}

export async function findOrCreateReviews(revModel, revData) {
  try {
    // Create an options object to specify that we want to upsert (insert if not found)
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    };

    // Array of promises from findOneandUpdate
    let promises = [];
    for (const revJson of revData) {
      console.log(`Adding review for ${revJson.course_code}`);
      const revDoc = reviewJsonToDoc(revJson);

      // Define a query to find the user by a unique identifier (e.g., course id)
      const query = {
        $and: [
          { course_code: revDoc.course_code },
          { semester: revDoc.semester },
        ],
      };

      promises.push(revModel.findOneAndUpdate(query, revDoc, options));
    }

    return Promise.all(promises);
  } catch (error) {
    throw new Error(`Error when processing review data: ${error}`);
  }
}

export async function findOrCreateDrilldown(ddModel, ddData) {
  try {
    // Create an options object to specify that we want to upsert (insert if not found)
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    };

    // Array of promises from findOneandUpdate
    let promises = [];
    for (const ddJson of ddData) {
      console.log(`Adding drilldown data for ${ddJson.course_code}`);
      const ddDoc = drilldownJsonToDoc(ddJson);

      // Define a query to find the data by a unique identifier (e.g., course id)
      const query = {
        $and: [
          { course_code: ddDoc.course_code },
          { semester: ddDoc.semester },
        ],
      };

      promises.push(ddModel.findOneAndUpdate(query, ddDoc, options));
    }

    return Promise.all(promises);
  } catch (error) {
    throw new Error(`Error when processing drilldown data: ${error}`);
  }
}

export async function findOrCreateAndUpdateCourse(courseModel, crsJSON) {
  try {
    // create doc from course JSON for update
    const crsObject = courseJSONToDoc(crsJSON);

    // Define a query to find the user by a unique identifier (e.g., course id)
    const query = { crs_code: crsObject.crs_code };

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
      console.log(`Updating: ${crsObject.crs_code}`);
      return false;
    } else {
      console.log(`Adding new course: ${crsObject.crs_code}`);
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
