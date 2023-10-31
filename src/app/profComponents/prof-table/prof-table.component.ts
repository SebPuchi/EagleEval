import { Component,OnInit } from '@angular/core';
import {CourseTableData, ProfessorService} from "src/app/PageDataService/professor.service";

@Component({
  selector: 'app-prof-table',
  templateUrl: './prof-table.component.html',
  styleUrls: ['./prof-table.component.css']
})
export class ProfTableComponent implements OnInit {
courseData: CourseTableData[] = [];

//     title: string;
//     crs_code: string;
//     course_overall: number;
//     effort_hours: number;


  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getcrsTableData().subscribe((data: CourseTableData[] | null) => {
      if (data) {
        this.courseData = data;
      }
    });
  }
}
