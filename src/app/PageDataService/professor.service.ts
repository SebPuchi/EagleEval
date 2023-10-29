import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  constructor() { }

    private course_code: string = "CSCI224301";
    private semester: string = "Fall 2020";
    private instructor: string = "Carl Mctague";

  //***** VALUES THAT NEED TO BE AVERAGED *****//
 //   private attendancenecessary: number = 4.75;
    private availableforhelpoutsideofclass: number = 4.69;
  //  private coursewellorganized: number = 4.47;
    private instructorclearexplanations: number = 4.28;
    private instructorprepared: number = 4.75;
    private stimulatedinterestinthesubjectmatter: number = 4.81;
    private instructor_overall: number = 3.29;
    //**********************************//

    private school: string = "Morrissey College of Arts and Sciences";
    private department: string = "Computer Science";
    private course_name: string = "Logic and Computation";

    get courseCode(): string {
      return this.course_code;
    }

    set courseCode(value: string) {
      this.course_code = value;
    }

    get semesterValue(): string {
      return this.semester;
    }

    set semesterValue(value: string) {
      this.semester = value;
    }





    get availableForHelpOutsideOfClass(): number {
      return this.availableforhelpoutsideofclass;
    }

    set availableForHelpOutsideOfClass(value: number) {
      this.availableforhelpoutsideofclass = value;
    }

    get courseName(): string {
      return this.course_name;
    }

    set courseName(value: string) {
      this.course_name = value;
    }


    get instructorName(): string {
      return this.instructor;
    }

    set instructorName(value: string) {
      this.instructor = value;
    }

    get instructorClearExplanations(): number {
      return this.instructorclearexplanations;
    }

    set instructorClearExplanations(value: number) {
      this.instructorclearexplanations = value;
    }

    get instructorPrepared(): number {
      return this.instructorprepared;
    }

    set instructorPrepared(value: number) {
      this.instructorprepared = value;
    }

    get stimulatedInterestInSubjectMatter(): number {
      return this.stimulatedinterestinthesubjectmatter;
    }

    set stimulatedInterestInSubjectMatter(value: number) {
      this.stimulatedinterestinthesubjectmatter = value;
    }

    get instructorOverall(): number {
      return this.instructor_overall;
    }

    set instructorOverall(value: number) {
      this.instructor_overall = value;
    }

    get schoolName(): string {
      return this.school;
    }

    set schoolName(value: string) {
      this.school = value;
    }

    get departmentName(): string {
      return this.department;
    }

    set departmentName(value: string) {
      this.department = value;
    }


}
