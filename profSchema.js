import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for course data
export const profSchema = new Schema({
  title: String,
  firstName: String,
  lastName: String,
  address: String,
  office: String,
  education: [String],
  email: String,
  phone: String,
  profileImage: String,
});
