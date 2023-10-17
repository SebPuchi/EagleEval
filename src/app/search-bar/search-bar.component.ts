import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppSettings } from '../appSettings';

interface ProfData {
  _id: string;
  title: string;
  score: number;
  crs_code: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  selectedResult: string = '';

  suggestedProfs: string[] = [];
  seggestedCourses: string[] = [];

  constructor(private apiService: ApiService) {}

  searchProfsorCourse($query: string, route: string) {
    const url: string = AppSettings.API_ENDPOINT + route;

    this.apiService.getSearchResults($query, url).subscribe((data: any) => {
      return data;
    });
  }

  search($event: any) {}
}
