import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAssignHelpfulComponent } from './course-assign-helpful.component';

describe('CourseAssignHelpfulComponent', () => {
  let component: CourseAssignHelpfulComponent;
  let fixture: ComponentFixture<CourseAssignHelpfulComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseAssignHelpfulComponent]
    });
    fixture = TestBed.createComponent(CourseAssignHelpfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
