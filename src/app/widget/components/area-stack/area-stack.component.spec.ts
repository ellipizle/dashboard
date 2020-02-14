import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaStackComponent } from './area-stack.component';

describe('AreaStackComponent', () => {
  let component: AreaStackComponent;
  let fixture: ComponentFixture<AreaStackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaStackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
