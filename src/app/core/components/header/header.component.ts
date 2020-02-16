import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { TimerService } from '../../../shared/services/timer.service';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.scss' ]
	// encapsulation: ViewEncapsulation.ShadowDom
})
export class HeaderComponent implements OnInit {
	@ViewChild('poprefresh') popRefresh: any;
	@ViewChild('popDatePicker') popDatePicker: any;
	themeControl = new FormControl();
	refreshToggle: boolean = false;
	timeRangeToggle: boolean;
	refreshTime: any;
	refreshList = [
		{ label: 'Off', value: 'Off' },
		{ label: '5s', value: 5000 },
		{ label: '10s', value: 10000 },
		{ label: '30s', value: 30000 },
		{ label: '1m', value: 60000 },
		{ label: '5m', value: 300000 },
		{ label: '15m', value: 900000 },
		{ label: '30m', value: 1800000 },
		{ label: '1h', value: 3600000 },
		{ label: '2h', value: 7200000 },
		{ label: '1d', value: 86400000 }
	];
	themes = [ 'Dark', 'Default' ];
	selectedTheme: string = 'dark';

	//date range
	range: Range = { fromDate: new Date(), toDate: new Date() };
	options: NgxDrpOptions;
	presets: Array<PresetItem> = [];

	constructor(
		private timer: TimerService,
		private layoutService: LayoutService,
		private _dialog: MatDialog,
		private dashboardSvc: DashboardService
	) {}

	ngOnInit() {
		const today = new Date();
		const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
		const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
		const toMax = new Date(today.getFullYear(), today.getMonth() + 2, 0);

		this.setupPresets();
		this.options = {
			presets: this.presets,
			format: 'mediumDate',
			range: { fromDate: today, toDate: today },
			applyLabel: 'Submit',
			calendarOverlayConfig: {
				// shouldCloseOnBackdropClick: false
				// hasBackDrop: false
			}
			// https://play.grafana.org/d/000000012/grafana-play-home?orgId=1&from=1581552000000&to=1582329599000
			// https://play.grafana.org/d/000000012/grafana-play-home?orgId=1&from=1581552000000&to=1582329599000&fullscreen&panelId=2
			// cancelLabel: "Cancel",
			// excludeWeekends:true,
			// fromMinMax: {fromDate:fromMin, toDate:fromMax},
			// toMinMax: {fromDate:toMin, toDate:toMax}
		};
	}

	// handler function that receives the updated date range object
	updateRange(range: Range) {
		this.range = range;
	}

	onDatePicker() {
		this.refreshToggle == !this.refreshToggle;
		this.popDatePicker.toggle();
	}

	refreshToggleClicked() {
		this.refreshToggle == !this.refreshToggle;
		this.popRefresh.toggle();
	}

	onRefresh() {
		this.timer.setRefreshObs(true);
	}

	refreshTimeSelected(time) {
		this.refreshTime = time.label;
		this.timer.setIntervalObs(time.value);
		this.popRefresh.toggle();
	}
	// helper function to create initial presets
	setupPresets() {
		const backDate = (numOfDays) => {
			const today = new Date();
			return new Date(today.setDate(today.getDate() - numOfDays));
		};

		const today = new Date();
		const yesterday = backDate(1);
		const minus7 = backDate(7);
		const minus30 = backDate(30);
		const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
		const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
		const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

		this.presets = [
			{ presetLabel: 'Yesterday', range: { fromDate: yesterday, toDate: today } },
			{ presetLabel: 'Last 7 Days', range: { fromDate: minus7, toDate: today } },
			{ presetLabel: 'Last 30 Days', range: { fromDate: minus30, toDate: today } },
			{ presetLabel: 'This Month', range: { fromDate: currMonthStart, toDate: currMonthEnd } },
			{ presetLabel: 'Last Month', range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
		];
	}

	public newWidget() {
		const dialogRef = this._dialog.open(WidgetDialogComponent, {
			width: '600px'
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				console.log(res);
				this.layoutService.addItem(res);
			}
		});
	}
}
