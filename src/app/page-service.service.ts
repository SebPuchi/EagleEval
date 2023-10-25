import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {

    showHomePage: boolean = false;
    showProfPage: boolean = false;
    showClassPage: boolean = false;

  constructor(private router: Router) {}


  setShowHomePage() {
       this.router.navigate(['']);
    }

    setShowProfPage() {
      this.router.navigate(['professor']);
    }

    setShowClassPage() {

      this.router.navigate(['classes']);

    }


}
