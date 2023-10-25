import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {

    showHomePage: boolean = true;
    showProfPage: boolean = false;
    showClassPage: boolean = false;

  constructor(private router: Router) {}


  setShowHomePage() {
       this.showHomePage = true;
    }

  hideHomePage() {
       this.showHomePage = false;
    }

    setShowProfPage() {
      this.router.navigate(['professor']);
       this.showHomePage = false;

    }

    setShowClassPage() {

      this.router.navigate(['classes']);
      this.showHomePage = false;

    }



}
