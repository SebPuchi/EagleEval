import { Injectable } from '@angular/core';

export interface ProfPageData {
  title: string;
  education?: string[];
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profileImage?: string;
  avgOverall?: number;
  avgPrepared?: number;
  avgExplains?: number;
  avgAvailable?: number;
  avgEnthusiastic?: number;
}

export interface CourseTableData {
  title: string;
  crs_code: string;
  course_overall: number;
  effort_hours: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  constructor() {
    this._prof_data = null;
    this._table_data = null;
  }

  // Define variables
  private _prof_data: ProfPageData | null;
  private _table_data: CourseTableData[] | null;

  // Prof data setters and getters
  get ProfPageData(): ProfPageData | null {
    return this._prof_data;
  }

  set ProfPageData(data: ProfPageData | null) {
    this._prof_data = data;
  }

  // Course table setters and getters
  get crsTableData(): CourseTableData[] | null {
    return this._table_data;
  }

  set crsTableData(data: CourseTableData[] | null) {
    this._table_data = data;
  }
}
