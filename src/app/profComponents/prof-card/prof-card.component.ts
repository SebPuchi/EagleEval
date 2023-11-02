import { Component, OnInit } from '@angular/core';
import {
  ProfPageData,
  ProfessorService,
} from 'src/app/PageDataService/professor.service';

@Component({
  selector: 'app-prof-card',
  templateUrl: './prof-card.component.html',
  styleUrls: ['./prof-card.component.css'],
})
export class ProfCardComponent implements OnInit {
  professorName: string = '';
  professorImgURL: string = '';

  constructor(private prof: ProfessorService) {}
  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.title) {
          this.professorName = data.title;
        } else {
          this.professorName = 'No Data';
        }

        if (data.profileImage) {
          this.professorImgURL = encodeURI(
            'https://bc.edu' + data.profileImage
          );
        }
      }

      //Communciate skeleton
    });
  }
}
