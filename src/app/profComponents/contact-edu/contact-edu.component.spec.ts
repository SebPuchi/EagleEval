import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEDUComponent } from './contact-edu.component';

describe('ContactEDUComponent', () => {
  let component: ContactEDUComponent;
  let fixture: ComponentFixture<ContactEDUComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactEDUComponent]
    });
    fixture = TestBed.createComponent(ContactEDUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
