import { Component,OnInit } from '@angular/core';
import {CoursePageData, ClassService} from "src/app/PageDataService/class.service";

@Component({
  selector: 'app-course-info-card',
  templateUrl: './course-info-card.component.html',
  styleUrls: ['./course-info-card.component.css']
})
export class CourseInfoCardComponent implements OnInit {
  public courseTitle: string = "";
  public crsSubject: string = "";
  public crsCode: string = "";
  public crsCollege: string ="";

  constructor(private course: ClassService) {
    }

    ngOnInit() {

    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
          if (data) {

            if(data.title){

             this.courseTitle = data.title;

            }

            if(data.crs_code){

                         this.crsCode = data.crs_code;

                        }

                        if(data.subject){

                                     this.crsSubject = data.subject;

                                    }

                                    if(data.college){

                                                 this.crsCollege = data.college;

                                                }
          }

          //Communciate skeleton
        })

    }


  }
