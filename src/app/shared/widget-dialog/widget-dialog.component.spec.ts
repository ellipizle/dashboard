import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWidgetDialogComponent } from './widget-dialog.component';

describe('WidgetDialogComponent', () => {
	let component: EditWidgetDialogComponent;
	let fixture: ComponentFixture<EditWidgetDialogComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ EditWidgetDialogComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(EditWidgetDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
