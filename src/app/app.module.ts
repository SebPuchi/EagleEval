import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Primeng angular module imports

import { CardModule } from 'primeng/card';
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
import { KnobModule } from 'primeng/knob';

//PROF + CLASS SERVICE

import { ProfessorService } from 'src/app/PageDataService/professor.service';
import { ClassService } from 'src/app/PageDataService/class.service';
import { ScoreKnobComponent } from './profComponents/score-knob/score-knob.component';
import { ProfCardComponent } from './profComponents/prof-card/prof-card.component';
import { ProfContactComponent } from './profComponents/prof-contact/prof-contact.component';
import { InstructorPreparedComponent } from './profComponents/instructor-prepared/instructor-prepared.component';
import { ClearMaterialComponent } from './profComponents/clear-material/clear-material.component';
import { AviblOutsideClassComponent } from './profComponents/avibl-outside-class/avibl-outside-class.component';
import { EnthCourseMaterialComponent } from './profComponents/enth-course-material/enth-course-material.component';

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
  routingComponents,
  ScoreKnobComponent,
  ProfCardComponent,
  ProfContactComponent,
  InstructorPreparedComponent,
  ClearMaterialComponent,
  AviblOutsideClassComponent,
  EnthCourseMaterialComponent
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
		KnobModule,
		FormsModule,
		BrowserAnimationsModule

	],
	providers: [PageServiceService,ProfessorService,ClassService],
	bootstrap: [AppComponent]

})
export class AppModule {}
