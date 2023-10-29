import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreKnobComponent } from './score-knob.component';

describe('ScoreKnobComponent', () => {
  let component: ScoreKnobComponent;
  let fixture: ComponentFixture<ScoreKnobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreKnobComponent]
    });
    fixture = TestBed.createComponent(ScoreKnobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
