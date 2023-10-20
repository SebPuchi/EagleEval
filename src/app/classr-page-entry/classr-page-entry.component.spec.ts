import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassrPageEntryComponent } from './classr-page-entry.component';

describe('ClassrPageEntryComponent', () => {
  let component: ClassrPageEntryComponent;
  let fixture: ComponentFixture<ClassrPageEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassrPageEntryComponent]
    });
    fixture = TestBed.createComponent(ClassrPageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
