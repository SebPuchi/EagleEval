// professor.model.ts
import mongoose, { Schema, Document } from 'mongoose';

// Define the Professor Interface
export interface IProfessor extends Document {
  name: string;
  title?: string;
  email?: string;
  address?: string;
  phone?: string;
}

// Define the Professor Schema
const professorSchema: Schema<IProfessor> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  title: String,
  address: String,
  phone: String,
});

// Create the Professor model
const ProfessorModel = mongoose.model<IProfessor>('Professor', professorSchema);

export default ProfessorModel;
