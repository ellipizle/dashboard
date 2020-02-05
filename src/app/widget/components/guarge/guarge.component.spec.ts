import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuargeComponent } from './guarge.component';

describe('GuargeComponent', () => {
  let component: GuargeComponent;
  let fixture: ComponentFixture<GuargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
