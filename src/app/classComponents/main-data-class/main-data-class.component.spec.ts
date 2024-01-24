import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDataClassComponent } from './main-data-class.component';

describe('MainDataClassComponent', () => {
  let component: MainDataClassComponent;
  let fixture: ComponentFixture<MainDataClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDataClassComponent]
    });
    fixture = TestBed.createComponent(MainDataClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
