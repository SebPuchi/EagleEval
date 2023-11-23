// course.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Course Interface
export interface ICourse extends Document {
  name: string;
  code: string;
  college: string;
  subject: string;
  description?: string;
}

// Define the Course Schema
const courseSchema: Schema<ICourse> = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  college: { type: String, required: true },
  subject: { type: String, required: true },
  description: String,
});

// Create the Course model
const CourseModel = mongoose.model<ICourse>('Course', courseSchema);

export default CourseModel;
