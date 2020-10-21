import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiintegrationComponent } from './apiintegration.component';

describe('ApiintegrationComponent', () => {
  let component: ApiintegrationComponent;
  let fixture: ComponentFixture<ApiintegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiintegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiintegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
