import { Component } from '@angular/core';

@Component({
  selector: 'app-prof-card',
  templateUrl: './prof-card.component.html',
  styleUrls: ['./prof-card.component.css']
})
export class ProfCardComponent {
 professorName: string = "";
 professroImgURL: string = "";
constructor() {
    this.professorName = "No Data";
    this.professroImgURL = "https://www.bc.edu/content/bc-web/schools/morrissey/departments/computer-science/people/faculty-directory/noami-bolotin/_jcr_content/profileImage.img.png";

  }

}
