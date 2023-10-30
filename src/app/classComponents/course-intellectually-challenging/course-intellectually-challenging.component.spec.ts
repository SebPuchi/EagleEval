import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseIntellectuallyChallengingComponent } from './course-intellectually-challenging.component';

describe('CourseIntellectuallyChallengingComponent', () => {
  let component: CourseIntellectuallyChallengingComponent;
  let fixture: ComponentFixture<CourseIntellectuallyChallengingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseIntellectuallyChallengingComponent]
    });
    fixture = TestBed.createComponent(CourseIntellectuallyChallengingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
