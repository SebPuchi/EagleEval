import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseWellOrganizedComponent } from './course-well-organized.component';

describe('CourseWellOrganizedComponent', () => {
  let component: CourseWellOrganizedComponent;
  let fixture: ComponentFixture<CourseWellOrganizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseWellOrganizedComponent]
    });
    fixture = TestBed.createComponent(CourseWellOrganizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
