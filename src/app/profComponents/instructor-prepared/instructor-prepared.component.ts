import { Component, OnInit } from '@angular/core';
import {
  ProfPageData,
  ProfessorService,
} from 'src/app/PageDataService/professor.service';
@Component({
  selector: 'app-instructor-prepared',
  templateUrl: './instructor-prepared.component.html',
  styleUrls: ['./instructor-prepared.component.css'],
})
export class InstructorPreparedComponent implements OnInit {
  instructorPreparedValue: number = 0;

  constructor(private prof: ProfessorService) {}

  ngOnInit() {
    this.prof.getProfPageData().subscribe((data: ProfPageData | null) => {
      if (data) {
        if (data.avgPrepared) {
          this.instructorPreparedValue = data.avgPrepared;
        }
      } else {
        this.instructorPreparedValue = 0;
      }

      //Communciate skeleton
    });
  }
}
