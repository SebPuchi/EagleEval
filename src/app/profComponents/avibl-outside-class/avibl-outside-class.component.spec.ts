import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AviblOutsideClassComponent } from './avibl-outside-class.component';

describe('AviblOutsideClassComponent', () => {
  let component: AviblOutsideClassComponent;
  let fixture: ComponentFixture<AviblOutsideClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AviblOutsideClassComponent]
    });
    fixture = TestBed.createComponent(AviblOutsideClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
