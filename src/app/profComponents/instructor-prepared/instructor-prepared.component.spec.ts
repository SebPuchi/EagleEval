import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorPreparedComponent } from './instructor-prepared.component';

describe('InstructorPreparedComponent', () => {
  let component: InstructorPreparedComponent;
  let fixture: ComponentFixture<InstructorPreparedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructorPreparedComponent]
    });
    fixture = TestBed.createComponent(InstructorPreparedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
