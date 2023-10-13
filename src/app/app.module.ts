import { NgModule } from '@angular/core';
import { BrowserModule }
	from '@angular/platform-browser';
import { AppRoutingModule }
	from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule }
	from '@angular/common/http';

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

@NgModule({
	declarations: [
		AppComponent,
  HomeBarComponent,
  HeroSectionComponent,
  FooterComponent,
  DescriptionhmComponent,
  TripleCardSectionComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ButtonModule,
		MenubarModule,
		ImageModule,
		InputTextModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
