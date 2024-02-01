import { Component, OnInit } from '@angular/core';

interface City {
  name: string;
  code: string;
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

  cities: City[] | undefined;

    selectedCity: City | undefined;


  

  showDialog() {
      this.visible = true;
  }


  ngOnInit() {
    this.cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
}
}
