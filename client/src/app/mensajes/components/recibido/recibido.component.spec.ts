import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibidoComponent } from './recibido.component';

describe('RecibidoComponent', () => {
  let component: RecibidoComponent;
  let fixture: ComponentFixture<RecibidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecibidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
