import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorCard } from './prof-card.component';

describe('ProfessorCard', () => {
  let component: ProfessorPageEntryComponent;
  let fixture: ComponentFixture<ProfessorPageEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorCard],
    });
    fixture = TestBed.createComponent(ProfessorPageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
