import { Component,OnInit } from '@angular/core';
import {CourseTableData, ProfPageData, ProfessorService} from "src/app/PageDataService/professor.service";

@Component({
  selector: 'app-prof-table',
  templateUrl: './prof-table.component.html',
  styleUrls: ['./prof-table.component.css']
})
export class ProfTableComponent implements OnInit {
courseData: CourseTableData[] = [];

profName: string = "";

//     title: string;
//     crs_code: string;
//     course_overall: number;
//     effort_hours: number;


  constructor(private prof: ProfessorService) {}

  ngOnInit() {
     this.prof.getcrsTableData().subscribe((data: CourseTableData[] | null) => {
       if (data) {
         this.courseData = data;

         // Replace -1 with 'NaN' in effort_hours
         this.courseData.forEach(course => {
           if (course.effort_hours === -1) {
             course.effort_hours = NaN;
           }
         });
       }
     });

       this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
             if (data) {

               if(data.title){

                this.profName = data.title;

               }
             }

           })



   }
 }
