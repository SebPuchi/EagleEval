import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfTableComponent } from './prof-table.component';

describe('ProfTableComponent', () => {
  let component: ProfTableComponent;
  let fixture: ComponentFixture<ProfTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfTableComponent]
    });
    fixture = TestBed.createComponent(ProfTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
