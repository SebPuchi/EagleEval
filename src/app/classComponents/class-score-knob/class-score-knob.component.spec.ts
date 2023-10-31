import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassScoreKnobComponent } from './class-score-knob.component';

describe('ClassScoreKnobComponent', () => {
  let component: ClassScoreKnobComponent;
  let fixture: ComponentFixture<ClassScoreKnobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassScoreKnobComponent]
    });
    fixture = TestBed.createComponent(ClassScoreKnobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
