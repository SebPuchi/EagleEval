import { Component, OnInit } from '@angular/core';
import {
  ProfPageData,
  ProfessorService,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-enth-course-material',
  templateUrl: './enth-course-material.component.html',
  styleUrls: ['./enth-course-material.component.css'],
})
export class EnthCourseMaterialComponent implements OnInit {
  enthCourseValue: number = 0;
  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.avgEnthusiastic) {
          this.enthCourseValue = data.avgEnthusiastic;
        } else {
          this.enthCourseValue = 0;
        }
      }

      //Communciate skeleton
    });
  }
}
