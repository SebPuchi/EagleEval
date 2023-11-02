import { Component, OnInit } from '@angular/core';
import {
  ProfPageData,
  ProfessorService,
} from 'src/app/PageDataService/professor.service';
@Component({
  selector: 'app-clear-material',
  templateUrl: './clear-material.component.html',
  styleUrls: ['./clear-material.component.css'],
})
export class ClearMaterialComponent implements OnInit {
  clearMaterialValue: number = 0;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.avgExplains) {
          this.clearMaterialValue = data.avgExplains;
        }
      } else {
        this.clearMaterialValue = 0;
      }

      //Communciate skeleton
    });
  }
}
