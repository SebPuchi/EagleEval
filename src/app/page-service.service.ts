import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageServiceService {



  constructor(private router: Router) {}



    setShowProfPage() {
      this.router.navigate(['professor']);

    }

    setShowClassPage() {

      this.router.navigate(['class']);

    }



}
