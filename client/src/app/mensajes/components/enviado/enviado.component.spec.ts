import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadoComponent } from './enviado.component';

describe('EnviadoComponent', () => {
  let component: EnviadoComponent;
  let fixture: ComponentFixture<EnviadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnviadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnviadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
