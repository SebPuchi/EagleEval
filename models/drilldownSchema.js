import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema fro drilldown data
export const drilldownSchema = new Schema({
  course_code: String,
  course_name: String,
  instructor: String,
  semester: String,
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

export const Drilldown = mongoose.model("Drilldown", drilldownSchema);
