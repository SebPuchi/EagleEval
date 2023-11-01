import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStatTableComponent } from './class-stat-table.component';

describe('ClassStatTableComponent', () => {
  let component: ClassStatTableComponent;
  let fixture: ComponentFixture<ClassStatTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassStatTableComponent]
    });
    fixture = TestBed.createComponent(ClassStatTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
