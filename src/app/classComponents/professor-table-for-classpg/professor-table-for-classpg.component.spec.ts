import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorTableForClasspgComponent } from './professor-table-for-classpg.component';

describe('ProfessorTableForClasspgComponent', () => {
  let component: ProfessorTableForClasspgComponent;
  let fixture: ComponentFixture<ProfessorTableForClasspgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorTableForClasspgComponent]
    });
    fixture = TestBed.createComponent(ProfessorTableForClasspgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
