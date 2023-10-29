import { Injectable } from '@angular/core';

export interface CoursePageData {
  title: string;
  crs_code: string;
  subject: string;
  college: string;
  desc: string;
  avgOverall?: number;
  avgOriganized?: number;
  avgChallanging?: number;
  avgEffortHours?: number;
  avgAttendance?: number;
  avgAssignments?: number;
}

export interface ProfTableData {
  title: string;
  prof_overall: number;
  explains_material: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor() {
    this._course_data = null;
    this._table_data = null;
  }

  // Private variables
  private _course_data: CoursePageData | null;
  private _table_data: ProfTableData[] | null;

  // Prof data setters and getters
  get CoursePageData(): CoursePageData | null {
    return this._course_data;
  }

  set CoursePageData(data: CoursePageData | null) {
    this._course_data = data;
  }

  // Course table setters and getters
  get ProfTableData(): ProfTableData[] | null {
    return this._table_data;
  }

  set ProfTableData(data: ProfTableData[] | null) {
    this._table_data = data;
  }
}
