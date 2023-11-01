import { Component,OnInit } from '@angular/core';
import {CoursePageData, ClassService} from "src/app/PageDataService/class.service";

@Component({
  selector: 'app-course-avg-hours',
  templateUrl: './course-avg-hours.component.html',
  styleUrls: ['./course-avg-hours.component.css']
})
export class CourseAvgHoursComponent implements OnInit {

 public avgHours: number = NaN;

 constructor(private course: ClassService) {
    }

    ngOnInit() {

    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
          if (data) {

            if(data.avgEffortHours && data.avgEffortHours!= -1){

             this.avgHours = data.avgEffortHours;

            }




          }

          //Communciate skeleton
        })

    }


  }
