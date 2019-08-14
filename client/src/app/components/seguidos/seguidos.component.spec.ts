import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguidosComponent } from './seguidos.component';

describe('SeguidosComponent', () => {
  let component: SeguidosComponent;
  let fixture: ComponentFixture<SeguidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
