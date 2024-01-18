// drilldown.model.ts
import mongoose, { Schema, Types, Document } from 'mongoose';

// Define the Drilldown Interface
export interface IDrilldown extends Document {
  review_id: Types.ObjectId;
  coursewellorganized?: number | undefined;
  courseintellectuallychallenging?: number | undefined;
  effortavghoursweeklyc?: number | undefined;
  attendancenecessary?: number | undefined;
  assignmentshelpful?: number | undefined;
  instructorprepared?: number | undefined;
  instructorclearexplanations?: number | undefined;
  availableforhelpoutsideofclass?: number | undefined;
  stimulatedinterestinthesubjectmatter?: number | undefined;
}

// Define the Drilldown Schema
const drilldownSchema: Schema<IDrilldown> = new Schema({
  review_id: { type: Schema.Types.ObjectId, ref: 'Review', required: true },
  coursewellorganized: Number || undefined,
  courseintellectuallychallenging: Number || undefined,
  effortavghoursweeklyc: Number || undefined,
  attendancenecessary: Number || undefined,
  assignmentshelpful: Number || undefined,
  instructorprepared: Number || undefined,
  instructorclearexplanations: Number || undefined,
  availableforhelpoutsideofclass: Number || undefined,
  stimulatedinterestinthesubjectmatter: Number || undefined,
});

// Create the Drilldown model
const DrilldownModel = mongoose.model<IDrilldown>('Drilldown', drilldownSchema);

export default DrilldownModel;
