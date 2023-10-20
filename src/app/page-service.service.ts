import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {

    showHomePage: boolean = true;
    showProfPage: boolean = false;
    showClassPage: boolean = false;

  constructor() { }

  setShowHomePage() {
      this.showHomePage = true;
      this.showProfPage = false;
      this.showClassPage = false;
    }

    setShowProfPage() {
      this.showHomePage = false;
      this.showProfPage = true;
      this.showClassPage = false;
    }

    setShowClassPage() {
      this.showHomePage = false;
      this.showProfPage = false;
      this.showClassPage = true;
    }


}
