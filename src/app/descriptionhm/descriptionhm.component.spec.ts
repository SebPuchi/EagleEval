import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionhmComponent } from './descriptionhm.component';

describe('DescriptionhmComponent', () => {
  let component: DescriptionhmComponent;
  let fixture: ComponentFixture<DescriptionhmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionhmComponent]
    });
    fixture = TestBed.createComponent(DescriptionhmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
