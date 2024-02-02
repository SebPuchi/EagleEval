import { Component,OnInit } from '@angular/core';
import {ProfessorService,ProfPageData} from 'src/app/PageDataService/professor.service';


@Component({
  selector: 'app-main-data-card',
  templateUrl: './main-data-card.component.html',
  styleUrls: ['./main-data-card.component.css']
})
export class MainDataCardComponent implements OnInit {

  professorOvl: number | undefined = NaN;
  strokeColor: string = '#6d1f22';
  instructorPrepared: number = NaN;
  clearMaterial: number = NaN;
  outsideClass: number = NaN;
  enthusiastic: number = NaN;



  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {

        //Sets Knob
        if (data.avgOverall && data.avgOverall > 0) {
          this.professorOvl = data.avgOverall;
        } 
        //Sets instructorPrepared
        if (data.avgPrepared && data.avgPrepared > 0) {
          this.instructorPrepared = data.avgPrepared;
        } else{
          this.instructorPrepared = NaN;

        }
        //Sets clearMaterial
        if (data.avgExplains && data.avgExplains > 0) {
          this.clearMaterial = data.avgExplains;
        } else{
          this.clearMaterial = NaN;

        }
        //Sets outsideClass
        if (data.avgAvailable && data.avgAvailable > 0) {
          this.outsideClass = data.avgAvailable;
        } else{
          this.outsideClass = NaN;

        }
        //Sets enthusiastic
        if (data.avgEnthusiastic && data.avgEnthusiastic > 0) {
          this.enthusiastic = data.avgEnthusiastic;
        } else{
          this.enthusiastic = NaN;

        }
      }
    });
  }

  isValueNaN(value: number): boolean {
    return isNaN(value);
  }




}
