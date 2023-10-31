import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearMaterialComponent } from './clear-material.component';

describe('ClearMaterialComponent', () => {
  let component: ClearMaterialComponent;
  let fixture: ComponentFixture<ClearMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClearMaterialComponent]
    });
    fixture = TestBed.createComponent(ClearMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
