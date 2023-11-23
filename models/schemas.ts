import mongoose, { Document, Schema, Types } from 'mongoose';

// Define the User Interface
interface IUser extends Document {
  name: string;
  email: string;
}

// Define the Professor Interface
interface IProfessor extends Document {
  name: string;
  title?: string;
  email?: string;
  address?: string;
  phone?: string;
}

// Define the Course Interface
interface ICourse extends Document {
  name: string;
  code: string;
  college: string;
  subject: string;
  description?: string;
}

// Define the Drilldown Interface
interface IDrilldown extends Document {
  review_id: Types.ObjectId;
  coursewellorganized?: number;
  courseintellectuallychallenging?: number;
  effortavghoursweeklyc?: number;
  attendancenecessary?: number;
  assignmentshelpful?: number;
  instructorprepared?: number;
  instructorclearexplanations?: number;
  availableforhelpoutsideofclass?: number;
  stimulatedinterestinthesubjectmatter?: number;
}

// Define the Review Interface
interface IReview extends Document {
  professor_id: Types.ObjectId;
  course_id: Types.ObjectId;
  semester?: string;
  department?: string;
  school: string;
  instructor: string;
  instructor_overall?: number;
  course_overall?: number;
}

// Define the Comment Interface
interface IComment extends Document {
  user_id: Types.ObjectId;
  message: string;
  professor_id: Types.ObjectId;
  course_id: Types.ObjectId;
}

// Define the User Schema
const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
});

// Define the Professor Schema
const professorSchema: Schema<IProfessor> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  title: String,
  address: String,
  phone: String,
});

// Define the Course Schema
const courseSchema: Schema<ICourse> = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  college: { type: String, required: true },
  subject: { type: String, required: true },
  description: String,
});

// Define the Drilldown Schema
const drilldownSchema: Schema<IDrilldown> = new Schema({
  review_id: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  coursewellorganized: Number,
  courseintellectuallychallenging: Number,
  effortavghoursweeklyc: Number,
  attendancenecessary: Number,
  assignmentshelpful: Number,
  instructorprepared: Number,
  instructorclearexplanations: Number,
  availableforhelpoutsideofclass: Number,
  stimulatedinterestinthesubjectmatter: Number,
});

// Define the Review Schema
const reviewSchema: Schema<IReview> = new Schema({
  professor_id: {
    type: Schema.Types.ObjectId,
    ref: 'Professor',
    required: true,
  },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: String,
  department: String,
  school: { type: String, required: true },
  instructor: { type: String, required: true },
  instructor_overall: Number,
  course_overall: Number,
});

// Define the Comment Schema
const commentSchema: Schema<IComment> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  professor_id: { type: Schema.Types.ObjectId, ref: 'Professor' },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course' },
});

// Create the models
const UserModel = mongoose.model<IUser>('User', userSchema);
const ProfessorModel = mongoose.model<IProfessor>('Professor', professorSchema);
const CourseModel = mongoose.model<ICourse>('Course', courseSchema);
const DrilldownModel = mongoose.model<IDrilldown>('Drilldown', drilldownSchema);
const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);
const CommentModel = mongoose.model<IComment>('Comment', commentSchema);

// Export the models
export {
  UserModel,
  ProfessorModel,
  CourseModel,
  DrilldownModel,
  ReviewModel,
  CommentModel,
};
