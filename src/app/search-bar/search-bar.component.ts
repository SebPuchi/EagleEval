import { Component } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppSettings } from '../appSettings';
import { forkJoin, map } from 'rxjs';
import { PageServiceService } from 'src/app/page-service.service';

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

  profs: ProfData[] = [];
  courses: CourseData[] = [];


  constructor(private apiService: ApiService,
  public _pageService: PageServiceService ) {}


  route($event: any) {
    console.log('EVENT: ', $event);
    // Search profs
    for (const prof of this.profs) {
      if (prof.title == $event) {
        console.log(`Routing to ${$event} prof page`);
        this._pageService.setShowProfPage();
      }
    }
    // Search courses
    for (const crs of this.courses) {
      if (crs.title == $event) {
        this._pageService.setShowClassPage();
        console.log(`Routing to ${$event} course page`);
      }
    }
  }

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
          this.profs = <Array<ProfData>>response.profs;
          this.courses = <Array<CourseData>>response.courses;

          // initialize array for storing combined results
          let result: any[] = [];

          this.profs.map((prof: ProfData) => {
            result.push(prof);
          });
          this.courses.map((course: CourseData) => {
            result.push(course);
          });

          // Sort results by score
          result = result.sort((a, b) => b.score - a.score);

          // Return array for titles
          return Array.from(result, (r) => r.title);
        })
      )
      .subscribe((data) => {
        this.results = data;
      });
  }
}
