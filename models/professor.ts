// professor.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Professor Interface
export interface IProfessor extends Document {
  name: string;
  title?: string[];
  phone?: string;
  email?: string;
  address?: string;
  education?: string[];
  photoLink?: string;
}

// Define the Professor Schema
const professorSchema: Schema<IProfessor> = new Schema({
  name: { type: String, required: true },
  title: { type: [String] },
  email: String,
  phone: String,
  address: String,
  education: { type: [String] },
  photoLink: String,
});

// Create the Professor model
const ProfessorModel = mongoose.model<IProfessor>('Professor', professorSchema);

export default ProfessorModel;
