import { Component } from '@angular/core';

@Component({
  selector: 'app-prof-contact',
  templateUrl: './prof-contact.component.html',
  styleUrls: ['./prof-contact.component.css']
})
export class ProfContactComponent {

  public email: string = "N/A"
  public phone: string = "N/A";
  public office: string = "N/A";
  public educationDetails: string[] = ["N/A"];


}
