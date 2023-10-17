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

          this.apiService.getProfs($event).subscribe(
                (response: any) => {
                  // Assuming the response is an array of objects as shown in your initial question
                  response.forEach((item: any) => {
                    console.log('Title:', item.title);
                  });
                },
                (error: any) => {
                  console.error('Error:', error);
                }
              );


  }








}
