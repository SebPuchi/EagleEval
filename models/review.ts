// review.model.ts
import mongoose, { Schema, Types, Document } from 'mongoose';

// Define the Review Interface
export interface IReview extends Document {
  professor_id: Types.ObjectId;
  course_id: Types.ObjectId;
  prof: string;
  code: string;
  semester: string;
  section: number;
  instructor_overall?: number | undefined;
  course_overall?: number | undefined;
}

// Define the Review Schema
const reviewSchema: Schema<IReview> = new Schema({
  professor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  prof: String,
  code: String,
  semester: String,
  section: Number,
  instructor_overall: Number || undefined,
  course_overall: Number || undefined,
});

// Create the Review model
const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);

export default ReviewModel;
