import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  explains_material?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  constructor() {
    this._course_data = new BehaviorSubject<CoursePageData | null>(null);
    this._table_data = new BehaviorSubject<ProfTableData[] | null>(null);
  }

  // Define variables
  private _course_data: BehaviorSubject<CoursePageData | null>;
  private _table_data: BehaviorSubject<ProfTableData[] | null>;

  // Prof data setters and getters
  getProfPageData(): Observable<CoursePageData | null> {
    return this._course_data.asObservable();
  }

  setProfPageData(data: CoursePageData | null) {
    this._course_data.next(data);
  }

  // Course table setters and getters
  getcrsTableData(): Observable<ProfTableData[] | null> {
    return this._table_data.asObservable();
  }

  setcrsTableData(data: ProfTableData[] | null) {
    this._table_data.next(data);
  }
}
