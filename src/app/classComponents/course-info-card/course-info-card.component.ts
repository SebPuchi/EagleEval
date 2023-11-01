import { Component,OnInit } from '@angular/core';
import {CoursePageData, ClassService} from "src/app/PageDataService/class.service";

@Component({
  selector: 'app-course-info-card',
  templateUrl: './course-info-card.component.html',
  styleUrls: ['./course-info-card.component.css']
})
export class CourseInfoCardComponent implements OnInit {
  public courseTitle: string = "Not Available";
  public crsSubject: string = "Not Available";
  public crsCode: string = "Not Available";
  public crsCollege: string ="Not Available";
  public crsDesc: string ="Not Available";

  constructor(private course: ClassService) {
    }

    ngOnInit() {

    this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
          if (data) {

            if(data.title){

             this.courseTitle = data.title;

            }

             if(data.desc){

                         this.crsDesc = data.desc;

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
