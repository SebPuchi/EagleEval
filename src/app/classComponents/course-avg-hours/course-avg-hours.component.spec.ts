import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAvgHoursComponent } from './course-avg-hours.component';

describe('CourseAvgHoursComponent', () => {
  let component: CourseAvgHoursComponent;
  let fixture: ComponentFixture<CourseAvgHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseAvgHoursComponent]
    });
    fixture = TestBed.createComponent(CourseAvgHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
