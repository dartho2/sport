import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PProductsShowComponent } from './p-products-show.component';

describe('PProductsShowComponent', () => {
  let component: PProductsShowComponent;
  let fixture: ComponentFixture<PProductsShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PProductsShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PProductsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
