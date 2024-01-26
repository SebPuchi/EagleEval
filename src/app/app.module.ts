import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Primeng angular module imports

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { HomeBarComponent } from './home-bar/home-bar.component';
import { HeroSectionComponent } from './HomePageComponets/hero-section/hero-section.component';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from './footer/footer.component';
import { DescriptionhmComponent } from './HomePageComponets/descriptionhm/descriptionhm.component';
import { TripleCardSectionComponent } from './HomePageComponets/triple-card-section/triple-card-section.component';
import { SearchBarComponent } from './HomePageComponets/search-bar/search-bar.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HomePageComponent } from './HomePageComponets/home-page/home-page.component';
import { ProfessorPageEntryComponent } from './professor-page-entry/professor-page-entry.component';
import { ClassrPageEntryComponent } from './classr-page-entry/classr-page-entry.component';
import { PageServiceService } from './page-service.service';
import { ProgressBarModule } from 'primeng/progressbar'
import { KnobModule } from 'primeng/knob';


//PROF + CLASS SERVICE

import { ProfessorService } from 'src/app/PageDataService/professor.service';
import { ClassService } from 'src/app/PageDataService/class.service';

import { ContactEDUComponent } from './profComponents/contact-edu/contact-edu.component';
import { MainDataCardComponent } from './profComponents/main-data-card/main-data-card.component';
import { ClassDataProfComponent } from './profComponents/class-data-prof/class-data-prof.component';
import { ClassInfoCardComponent } from './classComponents/class-info-card/class-info-card.component';
import { MainDataClassComponent } from './classComponents/main-data-class/main-data-class.component';
import { ProfessorTableForClasspgComponent } from './classComponents/professor-table-for-classpg/professor-table-for-classpg.component';

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
  ContactEDUComponent,
  MainDataCardComponent,
  ClassDataProfComponent,
  ClassInfoCardComponent,
  MainDataClassComponent,
  ProfessorTableForClasspgComponent
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
		AccordionModule,
		FormsModule,
		BrowserAnimationsModule

	],
	providers: [PageServiceService,ProfessorService,ClassService],
	bootstrap: [AppComponent]

})
export class AppModule {}
