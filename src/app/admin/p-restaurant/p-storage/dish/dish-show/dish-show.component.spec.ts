import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishShowComponent } from './dish-show.component';

describe('DishShowComponent', () => {
  let component: DishShowComponent;
  let fixture: ComponentFixture<DishShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
