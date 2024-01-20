import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripleCardSectionComponent } from './triple-card-section.component';

describe('TripleCardSectionComponent', () => {
  let component: TripleCardSectionComponent;
  let fixture: ComponentFixture<TripleCardSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TripleCardSectionComponent]
    });
    fixture = TestBed.createComponent(TripleCardSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
