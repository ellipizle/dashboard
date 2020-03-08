import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelViewHeaderComponent } from './view-panel-header.component';

describe('PanelViewHeaderComponent', () => {
	let component: PanelViewHeaderComponent;
	let fixture: ComponentFixture<PanelViewHeaderComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ PanelViewHeaderComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(PanelViewHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
