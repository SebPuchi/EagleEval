import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for course data
const courseSchema = new Schema({
  title: String,
  college: String,
  crs_desc: String,
  subject: String,
  dept_code: String,
  crs_code: String,
});

export const Course = mongoose.model("Course", courseSchema);
