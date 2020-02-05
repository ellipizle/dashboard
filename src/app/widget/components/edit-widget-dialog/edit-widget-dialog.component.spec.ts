import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWidgetDialogComponent } from './edit-widget-dialog.component';

describe('EditWidgetDialogComponent', () => {
  let component: EditWidgetDialogComponent;
  let fixture: ComponentFixture<EditWidgetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWidgetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWidgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
