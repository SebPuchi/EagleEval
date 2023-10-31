import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAttendanceComponent } from './course-attendance.component';

describe('CourseAttendanceComponent', () => {
  let component: CourseAttendanceComponent;
  let fixture: ComponentFixture<CourseAttendanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseAttendanceComponent]
    });
    fixture = TestBed.createComponent(CourseAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
