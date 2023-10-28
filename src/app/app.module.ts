import { NgModule } from '@angular/core';
import { BrowserModule }
	from '@angular/platform-browser';
import { AppRoutingModule, routingComponents }
	from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule }
	from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Primeng angular module imports

import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { HomeBarComponent } from './home-bar/home-bar.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from './footer/footer.component';
import { DescriptionhmComponent } from './descriptionhm/descriptionhm.component';
import { TripleCardSectionComponent } from './triple-card-section/triple-card-section.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfessorPageEntryComponent } from './professor-page-entry/professor-page-entry.component';
import { ClassrPageEntryComponent } from './classr-page-entry/classr-page-entry.component';
import { PageServiceService } from './page-service.service';
import { ProgressBarModule } from 'primeng/progressbar'

//PROF + CLASS SERVICE

import { ProfessorService } from 'src/app/PageDataService/professor.service';
import { ClassService } from 'src/app/PageDataService/class.service';


@NgModule({
	declarations: [
		AppComponent,
  HomeBarComponent,
  HeroSectionComponent,
  FooterComponent,
  DescriptionhmComponent,
  TripleCardSectionComponent,
  SearchBarComponent,
  HomePageComponent,
  routingComponents
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ButtonModule,
		MenubarModule,
		AutoCompleteModule,
		ImageModule,
		InputTextModule,
		ProgressBarModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule

	],
	providers: [PageServiceService,ProfessorService,ClassService],
	bootstrap: [AppComponent]
})
export class AppModule { }

