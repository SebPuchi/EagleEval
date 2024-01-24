import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassInfoCardComponent } from './class-info-card.component';

describe('ClassInfoCardComponent', () => {
  let component: ClassInfoCardComponent;
  let fixture: ComponentFixture<ClassInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassInfoCardComponent]
    });
    fixture = TestBed.createComponent(ClassInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
