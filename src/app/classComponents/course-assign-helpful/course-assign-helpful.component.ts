import { Component, OnInit } from '@angular/core';
import {
  CoursePageData,
  ClassService,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-course-assign-helpful',
  templateUrl: './course-assign-helpful.component.html',
  styleUrls: ['./course-assign-helpful.component.css'],
})
export class CourseAssignHelpfulComponent implements OnInit {
  public assing_helpful: number = 0;

  constructor(private course: ClassService) {}

  ngOnInit() {
    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
      if (data) {
        if (data.avgAssignments && data.avgAssignments != -1) {
          this.assing_helpful = data.avgAssignments;
        }
      } else {
        this.assing_helpful = 0;
      }
    });
  }
}
