import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInButtonComponent } from './sign-in-button.component';

describe('SignInButtonComponent', () => {
  let component: SignInButtonComponent;
  let fixture: ComponentFixture<SignInButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInButtonComponent]
    });
    fixture = TestBed.createComponent(SignInButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
