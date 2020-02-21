import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { Router } from '@angular/router';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';

import { NotificationService, LayoutService, DashboardService, TimerService } from '../../../shared/services';

import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
const moment = _moment;
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';
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
	detailView: boolean;
	refreshToggle: boolean = false;
	timeRangeToggle: boolean;
	refreshTime: any;
	url: any = '';
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
	rangeList = [
		{ label: 'Last 5 minutes', short: '5m', start: 0, end: 0, step: 5 },
		{ label: 'Last 15 minutes', short: '15m', start: 0, end: 0, step: 15 },
		{ label: 'Last 30 minutes', short: '30m', start: 0, end: 0, step: 30 },
		{ label: 'Last 1 hour', short: '1h', start: 0, end: 0, step: 60 },
		{ label: 'Last 3 hours', short: '3h', start: 0, end: 0, step: 180 },
		{ label: 'Last 6 hours', short: '6h', start: 0, end: 0, step: 360 },
		{ label: 'Last 12 hours', short: '12h', start: 0, end: 0, step: 720 },
		{ label: 'Last 24 hours', short: '24h', start: 0, end: 0, step: 1440 },
		{ label: 'Last 2 days', short: '2d', start: 0, end: 0, step: 2880 }
	];

	dash = {
		apiVersion: 'ws.io/v1',
		kind: 'UserSetting',
		metadata: {
			name: 'dashboard-user1'
		},
		spec: {
			dashboard_layouts: [
				{
					name: 'dashboard1',
					layout: ''
				}
			]
		}
	};

	getDashboard() {
		this.dashboardSvc
			.getDashboard()
			.pipe
			// map((res) => {
			// 	let dash: any = res;
			// 	dash.spec.dashboard_layouts = JSON.parse(dash.spec.dashboard_layouts);
			// 	return dash;
			// })
			()
			.subscribe((res: any) => {
				this.dash = res;
				this.layoutService.layout = JSON.parse(res.spec.dashboard_layouts[0].layout);
			});
	}

	saveDashboard() {
		let layout = this.layoutService.layout;
		this.dash.spec.dashboard_layouts[0].layout = JSON.stringify(layout);
		this.dashboardSvc.saveDashboard(this.dash).subscribe(
			(res) => {
				this.noticeSvc.openSnackBar('Dashboard saved successfully', '');
			},
			(error) => {
				this.noticeSvc.openSnackBar('Failed to saved dashboard', '');
			}
		);
	}
	public setRange(range) {
		switch (range.short) {
			case '5m': {
				range.start = moment().subtract(5, 'm').unix();
				range.end = moment().unix();
			}
			case '15m': {
				range.start = moment().subtract(5, 'm').unix();
				range.end = moment().unix();
			}
			case '30m': {
				range.start = moment().subtract(5, 'm').unix();
				range.end = moment().unix();
			}
			case '1h': {
				range.start = moment().subtract(1, 'h').unix();
				range.end = moment().unix();
			}
			case '3h': {
				range.start = moment().subtract(3, 'h').unix();
				range.end = moment().unix();
			}
			case '6h': {
				range.start = moment().subtract(6, 'h').unix();
				range.end = moment().unix();
			}
			case '12h': {
				range.start = moment().subtract(12, 'h').unix();
				range.end = moment().unix();
			}
			case '24h': {
				range.start = moment().subtract(24, 'h').unix();
				range.end = moment().unix();
			}
			case '2d': {
				range.start = moment().subtract(2, 'd').unix();
				range.end = moment().unix();
			}
		}
		return range;
	}
	themes = [ 'Dark', 'Default' ];
	selectedTheme: string = 'dark';

	//date range
	range: any = 'Last 1 hour';
	// range: Range = { fromDate: new Date(), toDate: new Date() };
	options: NgxDrpOptions;
	presets: Array<PresetItem> = [];

	constructor(
		private timer: TimerService,
		private noticeSvc: NotificationService,
		private layoutService: LayoutService,
		private _dialog: MatDialog,
		private dashboardSvc: DashboardService,
		private route: Router,
		private location: Location
	) {
		// this.noticeSvc.openSnackBar('Dashboard saved successfully', '');
		this.route.events.subscribe((res) => {
			let url = this.location.path().split('/');
			if (url[2] && url[2] == 'panel') {
				this.detailView = true;
			} else {
				this.detailView = false;
			}
		});
		this.getDashboard();
	}

	ngOnInit() {
		this.timer.setDateRangeObs(this.setRange({ label: 'Last 1 hour', short: '1h', start: 0, end: 0, step: 60 }));
	}
	goBack() {
		this.route.navigate([ 'dashboard' ]);
	}

	// handler function that receives the updated date range object
	updateRange(range: any) {
		this.range = range.label;
		this.timer.setDateRangeObs(this.setRange(range));
		this.popDatePicker.toggle();
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
