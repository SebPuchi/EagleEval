import { Component, ViewChild, NgZone, AfterViewChecked } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AppSettings } from '../appSettings';
import { forkJoin, map } from 'rxjs';
import { PageServiceService } from 'src/app/page-service.service';
import { AutoComplete } from 'primeng/autocomplete';

interface ProfData {
  _id: string;
  name: string;
  score: number;
}

interface CourseData {
  _id: string;
  title: string;
  code: string;
  score: number;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent {
  @ViewChild('autoComplete', { static: true }) autoComplete:
    | AutoComplete
    | undefined;

  selectedResult: string = '';

  results: any[] = [];

  profs: ProfData[] = [];
  courses: CourseData[] = [];
  placeHolder: string = 'Professor or Class name';

  constructor(
    private apiService: ApiService,
    public _pageService: PageServiceService
  ) {}

  route($event: any) {
    const regex = /\(([^)]+)\)$/; // This regex matches text inside parentheses at the end of the string

    // Search profs
    for (const prof of this.profs) {
      if (prof.name == $event) {
        this._pageService.setShowProfPage(prof._id);
        return;
      }
    }
    // Search courses
    for (const crs of this.courses) {
      const match = $event.match(regex);
      if (crs.code == match[1]) {
        this._pageService.setShowClassPage(crs._id);
        return;
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
          return Array.from(result, (r) => {
            return r.code ? `${r.title} (${r.code})` : r.name;
          });
        })
      )
      .subscribe((data) => {
        this.results = data;
      });
  }
}
