import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppSettings } from '../appSettings';
import { forkJoin, map } from 'rxjs';

interface ProfData {
  _id: string;
  title: string;
  score: number;
}

interface CourseData {
  _id: string;
  title: string;
  crs_code: string;
  score: number;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  selectedResult: string = '';

  results: any[] = [];

  constructor(private apiService: ApiService) {}

  search($event: any) {
    const profRoute = AppSettings.API_ENDPOINT + 'search/profs';
    const crsRoute = AppSettings.API_ENDPOINT + 'search/courses';
    // Run api calls in parallel with combine latest
    forkJoin({
      profs: this.apiService.getSearchResults($event, profRoute),
      courses: this.apiService.getSearchResults($event, crsRoute),
    })
      .pipe(
        map((response) => {
          // Gets data from response
          const profs = <Array<any>>response.profs;
          const courses = <Array<any>>response.courses;

          // initialize array for storing combined results
          const result: any[] = [];

          profs.map((prof: ProfData) => {
            result.push(prof.title);
          });
          courses.map((course: CourseData) => {
            result.push(course.title + ' - ' + course.crs_code);
          });

          return result;
        })
      )
      .subscribe((data) => {
        this.results = data;
      });
  }
}
