import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import {ProfessorService} from "src/app/PageDataService/professor.service";
import {CollectDataService} from "src/app/collect-data/collect-data.service";

@Component({
  selector: 'app-professor-page-entry',
  templateUrl: './professor-page-entry.component.html',
  styleUrls: ['./professor-page-entry.component.css'],
})
export class ProfessorPageEntryComponent {



  constructor(private professorService: ProfessorService,
              private collectDataService: CollectDataService) {


  }
}
