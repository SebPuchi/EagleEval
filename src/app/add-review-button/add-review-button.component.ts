import { Component, OnInit } from '@angular/core';

interface Class {
  name: string;
}

@Component({
  selector: 'app-add-review-button',
  templateUrl: './add-review-button.component.html',
  styleUrls: ['./add-review-button.component.css']
})
export class AddReviewButtonComponent implements OnInit {

  visible: boolean = false;

  stateOptions: any[] = [{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}];

  value: string = 'no';

  classes: Class[] | undefined;

  selectedCity: Class | undefined;


  //logic for display 
  showDialog() {
      this.visible = true;
  }


  ngOnInit() {
    this.classes = [
        { name: 'CSCI1101'},
        { name: 'CSCI1102'},
        { name: 'CSCI2271'},
        { name: 'CSCI3401'},
        { name: 'CSCI1101'}
    ];
}
}
