import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  selectedProf: string = "";

  suggestedProfs: string [] = [];

  Constructor(){
      this.suggestedProfs = [
     "Professor Smith",
     "Professor Johnson",
     "Professor Williams",
     "Professor Brown"
   ];


  }

  search($event: any){
  console.log($event)
    this.suggestedProfs = [
       "Professor Smith",
       "Professor Johnson",
       "Professor Williams",
       "Professor Brown"
     ];


  }






}
