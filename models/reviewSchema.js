import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for review data
export const reviewSchema = new Schema({
  course_code: String,
  course_name: String,
  semester: String,
  department: String,
  school: String,
  instructor: String,
  instructor_overall: Number,
  course_overall: Number,
});

export const Review = mongoose.model("Review", reviewSchema);
