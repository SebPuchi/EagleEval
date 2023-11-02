import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PageServiceService {
  constructor(private router: Router) {}
  setShowProfPage(id: string) {
    this.router.navigate(['professor', id]);
  }
  setShowClassPage(id: string) {
    this.router.navigate(['class', id]);
  }
}
