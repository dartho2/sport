import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysticListComponent } from './analystic-list.component';

describe('AnalysticListComponent', () => {
  let component: AnalysticListComponent;
  let fixture: ComponentFixture<AnalysticListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysticListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
