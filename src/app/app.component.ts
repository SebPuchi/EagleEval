import { Component, OnInit } from '@angular/core';
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

	    showHomePage: boolean = true;
      showProfPage: boolean = false;
      showClassPage: boolean = false;
	constructor(private apiService: ApiService,
	            public _pageService: PageServiceService) { };
	ngOnInit() {

	}
}
