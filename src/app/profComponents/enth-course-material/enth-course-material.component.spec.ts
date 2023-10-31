import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnthCourseMaterialComponent } from './enth-course-material.component';

describe('EnthCourseMaterialComponent', () => {
  let component: EnthCourseMaterialComponent;
  let fixture: ComponentFixture<EnthCourseMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnthCourseMaterialComponent]
    });
    fixture = TestBed.createComponent(EnthCourseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
