// comment.model.ts
import mongoose, { Schema, Types, Document } from 'mongoose';

// Define the Comment Interface
export interface IComment extends Document {
  user_id: Types.ObjectId;
  message: string;
  createdAt: Date;
  wouldTakeAgain?: boolean;
  professor_id: Types.ObjectId;
  course_id: Types.ObjectId;
}

// Define the Comment Schema
const commentSchema: Schema<IComment> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  wouldTakeAgain: { type: Boolean },
  professor_id: { type: Schema.Types.ObjectId, ref: 'Professor' },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
});

// Create the Comment model
const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

export default CommentModel;
