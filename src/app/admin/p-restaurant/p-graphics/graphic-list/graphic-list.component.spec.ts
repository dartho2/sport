import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicListComponent } from './graphic-list.component';

describe('GraphicListComponent', () => {
  let component: GraphicListComponent;
  let fixture: ComponentFixture<GraphicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
