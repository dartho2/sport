import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColdListComponent } from './cold-list.component';

describe('ColdListComponent', () => {
  let component: ColdListComponent;
  let fixture: ComponentFixture<ColdListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColdListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
