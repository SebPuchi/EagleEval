import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfessorService } from 'src/app/PageDataService/professor.service';
import { CollectDataService } from '../collect-data/collect-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-professor-page-entry',
  templateUrl: './professor-page-entry.component.html',
  styleUrls: ['./professor-page-entry.component.css'],
})
export class ProfessorPageEntryComponent {
  constructor(
    private professorService: ProfessorService,
    private route: ActivatedRoute,
    private data: CollectDataService
  ) {}
  ngOnInit() {
    // Set prof data to null
    this.professorService.setProfPageData(null);

    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const profIdFromRoute = String(routeParams.get('profId'));

    // Populate prof data
    this.data.getCacheProfData(profIdFromRoute);
  }
}
