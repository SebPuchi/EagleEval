import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassService } from 'src/app/PageDataService/class.service';
import { CollectDataService } from '../collect-data/collect-data.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-classr-page-entry',
  templateUrl: './classr-page-entry.component.html',
  styleUrls: ['./classr-page-entry.component.css'],
})
export class ClassrPageEntryComponent {
  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private data: CollectDataService
  ) {}
  ngOnInit() {
    // Set prof data to null
    this.classService.setCoursePageData(null);

    // First get the product id from the current route.
    this.route.paramMap.subscribe((routeParams) => {
      // Set prof data to null
      this.classService.setCoursePageData(null);

      const id = String(routeParams.get('classId'));

      // Populate prof data
      this.data.getCacheCourseData(id);
    });
  }
}
