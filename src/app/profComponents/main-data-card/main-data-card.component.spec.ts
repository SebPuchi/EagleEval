import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDataCardComponent } from './main-data-card.component';

describe('MainDataCardComponent', () => {
  let component: MainDataCardComponent;
  let fixture: ComponentFixture<MainDataCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainDataCardComponent]
    });
    fixture = TestBed.createComponent(MainDataCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
