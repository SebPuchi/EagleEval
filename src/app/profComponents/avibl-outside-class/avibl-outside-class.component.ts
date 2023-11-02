import { Component, OnInit } from '@angular/core';
import {
  ProfPageData,
  ProfessorService,
} from 'src/app/PageDataService/professor.service';
@Component({
  selector: 'app-avibl-outside-class',
  templateUrl: './avibl-outside-class.component.html',
  styleUrls: ['./avibl-outside-class.component.css'],
})
export class AviblOutsideClassComponent implements OnInit {
  avlbOutsdClassValue: number = 0;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.avgAvailable) {
          this.avlbOutsdClassValue = data.avgAvailable;
        } else {
          this.avlbOutsdClassValue = 0;
        }
      }

      //Communciate skeleton
    });
  }
}
