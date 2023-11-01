import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import {ProfessorPageEntryComponent} from './professor-page-entry/professor-page-entry.component';
import {ClassrPageEntryComponent} from './classr-page-entry/classr-page-entry.component';
import {HomePageComponent} from './home-page/home-page.component';



const routes: Routes = [
{ path: 'professor/:profId', component: ProfessorPageEntryComponent},
{ path: 'class/:classId', component: ClassrPageEntryComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [HomePageComponent,ProfessorPageEntryComponent,ClassrPageEntryComponent];
