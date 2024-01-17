// drilldown.model.ts
import mongoose, { Schema, Types, Document } from 'mongoose';

// Define the Drilldown Interface
export interface IDrilldown extends Document {
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

// Create the Drilldown model
const DrilldownModel = mongoose.model<IDrilldown>('Drilldown', drilldownSchema);

export default DrilldownModel;
