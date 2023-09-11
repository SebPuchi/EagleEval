import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBarComponent } from './home-bar.component';

describe('HomeBarComponent', () => {
  let component: HomeBarComponent;
  let fixture: ComponentFixture<HomeBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeBarComponent]
    });
    fixture = TestBed.createComponent(HomeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
