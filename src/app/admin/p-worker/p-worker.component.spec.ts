import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PWorkerComponent } from './p-worker.component';

describe('PWorkerComponent', () => {
  let component: PWorkerComponent;
  let fixture: ComponentFixture<PWorkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PWorkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
