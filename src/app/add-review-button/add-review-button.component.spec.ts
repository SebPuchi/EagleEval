import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReviewButtonComponent } from './add-review-button.component';

describe('AddReviewButtonComponent', () => {
  let component: AddReviewButtonComponent;
  let fixture: ComponentFixture<AddReviewButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddReviewButtonComponent]
    });
    fixture = TestBed.createComponent(AddReviewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
