import { Component } from '@angular/core';

interface ProfData {
  _id: string;
  image: string;
  title: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avgRating: number;
  avgCourseRating: number;
  courses: string[];
  ddData: DrilldownData;
}

interface DrilldownData {}

@Component({
  selector: 'prof-card',
  templateUrl: './prof-card.component.html',
})
export class ProfessorCard {}
