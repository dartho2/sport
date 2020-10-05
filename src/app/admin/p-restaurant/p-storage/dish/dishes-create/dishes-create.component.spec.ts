import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesCreateComponent } from './dishes-create.component';

describe('DishesCreateComponent', () => {
  let component: DishesCreateComponent;
  let fixture: ComponentFixture<DishesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
