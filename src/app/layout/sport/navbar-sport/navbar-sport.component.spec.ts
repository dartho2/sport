import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSportComponent } from './navbar-sport.component';

describe('NavbarSportComponent', () => {
  let component: NavbarSportComponent;
  let fixture: ComponentFixture<NavbarSportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarSportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
