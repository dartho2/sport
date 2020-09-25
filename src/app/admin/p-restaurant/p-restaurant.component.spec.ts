import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PRestaurantComponent } from './p-restaurant.component';

describe('PRestaurantComponent', () => {
  let component: PRestaurantComponent;
  let fixture: ComponentFixture<PRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
