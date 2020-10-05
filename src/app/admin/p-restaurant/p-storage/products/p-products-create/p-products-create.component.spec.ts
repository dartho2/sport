import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PProductsCreateComponent } from './p-products-create.component';

describe('PProductsCreateComponent', () => {
  let component: PProductsCreateComponent;
  let fixture: ComponentFixture<PProductsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PProductsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PProductsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
