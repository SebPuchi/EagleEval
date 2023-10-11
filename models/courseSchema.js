import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for course data
const courseSchema = new Schema({
  title: String,
  college: String,
  crs_desc: String,
  subject: String,
  crs_id: {
    dept_code: String,
    crs_number: Number,
  },
});

export const Course = mongoose.model("Course", courseSchema);
