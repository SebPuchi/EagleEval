import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {

    showHomePage: boolean = true;
    showProfPage: boolean = false;
    showClassPage: boolean = false;

  constructor(private router: Router) {
   this.router.navigate(['home']);
   }


  setShowHomePage() {
      this.router.navigate(['home']);
      this.showProfPage = false;
      this.showClassPage = false;

    }

    setShowProfPage() {
      this.showHomePage = false;
      this.router.navigate(['professor']);
      this.showClassPage = false;
    }

    setShowClassPage() {
      this.showHomePage = false;
      this.showProfPage = false;
      this.router.navigate(['classes']);

    }


}
