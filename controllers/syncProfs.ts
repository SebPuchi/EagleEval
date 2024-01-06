import { findAndUpdateDocument } from '../utils/mongoUtils';
import ProfessorModel, { IProfessor } from '../models/professor';

export async function updateProf(prof: IProfessor): Promise<void> {
  const filter = {
    name: prof.name,
  };

  const newProf = await findAndUpdateDocument(ProfessorModel, filter, prof);

  if (newProf) {
    console.log('Updating data for: ', prof.name);
  }
  try {
  } catch (error) {
    console.log('Errror updating professor doc: ', error);
  }
}
