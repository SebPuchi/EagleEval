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

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ButtonModule,
		MenubarModule,
		ImageModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
