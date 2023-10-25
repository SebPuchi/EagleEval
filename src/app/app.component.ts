import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from './api.service';
import { PageServiceService } from './page-service.service';
import { Router } from '@angular/router';



@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'frontEnd';
	message: any;

	constructor(private apiService: ApiService,
	            public _pageService: PageServiceService,
	            private router: Router) {

	            };

   toProf(){

      this._pageService.setShowProfPage();


   }

   toClass(){
      this._pageService.setShowClassPage();

   }

   @HostListener('window:popstate', ['$event'])
         onPopState(event: Event) {

           console.log('Back button pressed');
            this._pageService.setShowHomePage();
         }


	ngOnInit() {

	}
}
