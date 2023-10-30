import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseInfoCardComponent } from './course-info-card.component';

describe('CourseInfoCardComponent', () => {
  let component: CourseInfoCardComponent;
  let fixture: ComponentFixture<CourseInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseInfoCardComponent]
    });
    fixture = TestBed.createComponent(CourseInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
