import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PProductsListComponent } from './p-products-list.component';

describe('PProductsListComponent', () => {
  let component: PProductsListComponent;
  let fixture: ComponentFixture<PProductsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PProductsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
