import { Component,OnInit } from '@angular/core';
import {CoursePageData, ClassService} from "src/app/PageDataService/class.service";


@Component({
  selector: 'app-class-score-knob',
  templateUrl: './class-score-knob.component.html',
  styleUrls: ['./class-score-knob.component.css']
})
export class ClassScoreKnobComponent implements OnInit {

  value: number | undefined;
  isDisabled: boolean = false;

  constructor(private course: ClassService) {
  }

  ngOnInit() {

  this.course.getCoursePageData().subscribe((data: CoursePageData | null) => {
        if (data) {

          if(data.avgOverall && data.avgOverall > 0){

           this.value = data.avgOverall;

          }else{
          this.value = NaN;
          this.isDisabled = true;

          }
        }

        //Communciate skeleton
      })

  }


}
