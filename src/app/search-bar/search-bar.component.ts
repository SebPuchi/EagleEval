import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';


interface ProfData {

  _id: string;
  title: string;
  score: number;
  crs_code: string;

}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  selectedProf: string = "";

  suggestedProfs: string[] = [];

  constructor(private apiService: ApiService){ }

 search($event: any) {
     this.apiService.getProfs($event).subscribe((data: any) => {
       this.suggestedProfs = data.map((item: any) => item.title);
     });
   }

}
