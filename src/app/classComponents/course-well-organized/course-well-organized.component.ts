import { Component, OnInit } from '@angular/core';
import {
  CoursePageData,
  ClassService,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-course-well-organized',
  templateUrl: './course-well-organized.component.html',
  styleUrls: ['./course-well-organized.component.css'],
})
export class CourseWellOrganizedComponent {
  public organized: number = 0;

  constructor(private course: ClassService) {}

  ngOnInit() {
    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
      if (data) {
        if (data.avgOriganized && data.avgOriganized != -1) {
          this.organized = data.avgOriganized;
        }
      } else {
        this.organized = 0;
      }
    });
  }
}
