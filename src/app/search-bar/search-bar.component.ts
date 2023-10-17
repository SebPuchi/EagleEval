import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  selectedProf: string = "";

  suggestedProfs: string [] = [];

  constructor(private apiService: ApiService){

  }

  search($event: any){

          console.log($event)
          console.log(this.apiService.getProfs($event))




  }








}
