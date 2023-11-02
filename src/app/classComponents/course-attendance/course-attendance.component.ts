import { Component, OnInit } from '@angular/core';
import {
  CoursePageData,
  ClassService,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-course-attendance',
  templateUrl: './course-attendance.component.html',
  styleUrls: ['./course-attendance.component.css'],
})
export class CourseAttendanceComponent implements OnInit {
  public avg_Attendance: number = 0;

  constructor(private course: ClassService) {}

  ngOnInit() {
    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
      if (data) {
        if (data.avgAttendance && data.avgAttendance != -1) {
          this.avg_Attendance = data.avgAttendance;
        } else {
          this.avg_Attendance = 0;
        }
      }
    });
  }
}
