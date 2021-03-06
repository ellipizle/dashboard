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
import { DARK_THEME, DEFAULT_THEME, Dark_echarts, Default_echarts } from '../../theme';
import { ConfigService } from '../../services/config.service';
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
			name: 'dashboard-user2'
		},
		spec: {
			dashboard_layouts: [
				{
					name: 'dashboard2',
					layout: ''
				}
			]
		}
	};

	getDashboard() {
		this.dashboardSvc.getDashboard().subscribe((res: any) => {
			this.dash = res;
			this.layoutService.layout = JSON.parse(res.spec.dashboard_layouts[0].layout);
		});
	}

	saveDashboard() {
		let layout = this.layoutService.layout;
		this.dash.spec.dashboard_layouts[0].layout = JSON.stringify(layout);
		// if(this.dash.spec)
		this.dashboardSvc.saveDashboard(this.dash).subscribe(
			(res: any) => {
				// console.log(res)
				this.dash = res;
				this.noticeSvc.openSnackBar('Dashboard saved successfully', '');
			},
			(error) => {
				this.noticeSvc.openSnackBar('Failed to saved dashboard', '');
			}
		);
	}
	public setRange(range) {
		let now = new Date();
		let start = moment.utc();
		let end = moment.utc();
		switch (range.short) {
			case '5m':
				range.start = start.subtract(5, 'minutes').unix();
				range.end = end.unix();
				return range;
			case '15m':
				range.start = start.subtract(15, 'minutes').unix();
				range.end = end.unix();
				return range;
			case '30m':
				range.start = start.subtract(30, 'minutes').unix();
				range.end = end.unix();
				return range;
			case '1h':
				range.start = start.subtract(1, 'hours').unix();
				range.end = end.unix();
				return range;

			case '3h':
				range.start = start.subtract(3, 'hours').unix();
				range.end = end.unix();
				return range;
			case '6h':
				range.start = start.subtract(6, 'hours').unix();
				range.end = end.unix();
				return range;
			case '12h':
				range.start = start.subtract(12, 'hours').unix();
				range.end = end.unix();
				return range;
			case '24h':
				range.start = start.subtract(24, 'hours').unix();
				range.end = end.unix();
				return range;
			case '2d':
				range.start = start.subtract(2, 'd').unix();
				range.end = end.unix();
				return range;
		}
	}
	themes = [ 'Dark', 'Default' ];
	selectedTheme: string = 'default';

	//date range
	range: any = 'Last 1 hour';
	options: NgxDrpOptions;
	presets: Array<PresetItem> = [];

	constructor(
		private timer: TimerService,
		private noticeSvc: NotificationService,
		private layoutService: LayoutService,
		private _dialog: MatDialog,
		private dashboardSvc: DashboardService,
		private route: Router,
		private location: Location,
		private configSvc: ConfigService
	) {
		this.layoutService.getEditedObs().subscribe((res) => {
			if (res) {
				// this.saveDashboard();
			}
		});
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
	onChangeTheme(theme) {
		if (theme === 'dark') {
			this.configSvc.setSelectedThemeObs({ echart: Dark_echarts, theme: DARK_THEME });
		} else {
			this.configSvc.setSelectedThemeObs({ echart: Default_echarts, theme: DEFAULT_THEME });
		}
		var element = document.getElementById('body');
		element.classList.toggle('dashboard-dark-theme');
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
