import { Component, OnInit } from '@angular/core';
import {
  ProfessorService,
  ProfPageData,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-main-data-card',
  templateUrl: './main-data-card.component.html',
  styleUrls: ['./main-data-card.component.css'],
})
export class MainDataCardComponent implements OnInit {
  professorOvl: number | undefined = NaN;
  strokeColor: string = '#6d1f22';
  instructorPrepared: number | undefined = undefined;
  clearMaterial: number | undefined = undefined;
  outsideClass: number | undefined = undefined;
  enthusiastic: number | undefined = undefined;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      this.professorOvl = data?.avgOverall || undefined;
      this.instructorPrepared = data?.avgPrepared || undefined;
      this.clearMaterial = data?.avgExplains || undefined;
      this.outsideClass = data?.avgAvailable || undefined;
      this.enthusiastic = data?.avgEnthusiastic || undefined;
    });
  }
}
