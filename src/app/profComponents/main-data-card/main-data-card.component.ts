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
  instructorPrepared: number | undefined = 50;
  clearMaterial: number | undefined = 50;
  outsideClass: number | undefined = 50;
  enthusiastic: number | undefined = 50;



  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.avgOverall && data.avgOverall > 0) {
          this.professorOvl = data.avgOverall;
        } else {
          this.professorOvl = NaN;
        }
      }
    });
  }









}
