import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for course data
const courseSchema = new Schema({
  title: String,
  college: String,
  crs_desc: String,
  subject: String,
  crs_id: {
    crs_number: Number,
    dept_code: String,
  },
});
