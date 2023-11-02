import { Component, OnInit } from '@angular/core';
import {
  CoursePageData,
  ClassService,
} from 'src/app/PageDataService/class.service';

@Component({
  selector: 'app-course-intellectually-challenging',
  templateUrl: './course-intellectually-challenging.component.html',
  styleUrls: ['./course-intellectually-challenging.component.css'],
})
export class CourseIntellectuallyChallengingComponent implements OnInit {
  public challenge: number = 0;

  constructor(private course: ClassService) {}

  ngOnInit() {
    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
      if (data) {
        if (data.avgChallanging && data.avgChallanging != -1) {
          this.challenge = data.avgChallanging;
        } else {
          this.challenge = 0;
        }
      }
    });
  }
}
