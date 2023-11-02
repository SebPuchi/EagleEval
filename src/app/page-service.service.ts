import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { ProfessorService } from './PageDataService/professor.service';
import { ClassService } from './PageDataService/class.service';

@Injectable({
  providedIn: 'root',
})
export class PageServiceService {
  constructor(
    private router: Router,
    private profService: ProfessorService,
    private classService: ClassService
  ) {}
  setShowProfPage(id: string) {
    this.profService.setProfPageData(null);
    this.router.navigate(['professor', id]);
  }
  setShowClassPage(id: string) {
    this.classService.setCoursePageData(null);
    this.router.navigate(['class', id]);
  }
}
