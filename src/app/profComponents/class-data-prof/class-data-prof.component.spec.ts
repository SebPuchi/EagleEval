import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassDataProfComponent } from './class-data-prof.component';

describe('ClassDataProfComponent', () => {
  let component: ClassDataProfComponent;
  let fixture: ComponentFixture<ClassDataProfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassDataProfComponent]
    });
    fixture = TestBed.createComponent(ClassDataProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
