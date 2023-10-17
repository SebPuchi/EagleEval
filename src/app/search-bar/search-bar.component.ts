import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  selectedProf: string = "";

  suggestedProfs: string [] = [];

  Constructor(private apiService: ApiService){

  }

  search($event: any){
  console.log($event)
    this.apiService.getProfs($event.query).subscribe(

    response => this.suggestedProfs = response.
    )




  }






}
