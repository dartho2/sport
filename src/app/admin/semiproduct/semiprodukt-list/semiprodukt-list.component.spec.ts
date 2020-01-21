import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiproduktListComponent } from './semiprodukt-list.component';

describe('SemiproduktListComponent', () => {
  let component: SemiproduktListComponent;
  let fixture: ComponentFixture<SemiproduktListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemiproduktListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiproduktListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
