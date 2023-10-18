import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorPageEntryComponent } from './professor-page-entry.component';

describe('ProfessorPageEntryComponent', () => {
  let component: ProfessorPageEntryComponent;
  let fixture: ComponentFixture<ProfessorPageEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorPageEntryComponent]
    });
    fixture = TestBed.createComponent(ProfessorPageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
