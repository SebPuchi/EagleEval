import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfCardComponent } from './prof-card.component';

describe('ProfCardComponent', () => {
  let component: ProfCardComponent;
  let fixture: ComponentFixture<ProfCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfCardComponent]
    });
    fixture = TestBed.createComponent(ProfCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
