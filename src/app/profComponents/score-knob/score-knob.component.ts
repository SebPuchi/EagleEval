import { Component,OnInit } from '@angular/core';
import {ProfPageData, ProfessorService} from "src/app/PageDataService/professor.service";


@Component({
  selector: 'app-score-knob',
  templateUrl: './score-knob.component.html',
  styleUrls: ['./score-knob.component.css']
})
export class ScoreKnobComponent implements OnInit {
  value: number | undefined;
  isDisabled: boolean = false;

  constructor(private prof: ProfessorService) {
  }

  ngOnInit() {

  this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
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
