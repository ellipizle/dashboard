import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy
} from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: [ './table.component.scss' ]
})
export class TableComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Input('filter')
	set filter(query: string) {
		if (query) {
			console.log(this.item);
			console.log(query);
			this._excludeSegmentItemName = query;
			this.getFilterData();
		}
	}

	_excludeSegmentItemID: string;
	_excludeSegmentItemName: string;
	_filter: string;
	displayedColumns = [];
	dataSource: any;
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	step: any = 1;
	currentView: string = 'all';
	pending: boolean;
	themeSubscription: any;
	options: any = {};
	colors: any;
	echarts: any;
	interval;
	duration;

	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private panelService: PanelService,
		private timerService: TimerService
	) {
		this.timerService.getRefreshObs().subscribe((res) => {
			if (res) {
				this.getData();
			}
		});
		this.timerService.getIntervalObs().subscribe((res) => {
			let self = this;
			if (typeof res === 'number') {
				this.interval = window.setInterval(function() {
					self.getData();
				}, res);
			} else {
				window.clearInterval(this.interval);
			}
		});
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	queryName(name: string) {
		switch (name) {
			case 'throughput-wired':
				return '{{ELLIPEE}}';
			case 'throughput-wireless':
				return '{{ELLIPEE}}';
			case 'traffic-by-app-category':
				return '{{APPCATEGORY}}';
			case 'traffic-by-suite':
				return '{{SUITE}}';
			case 'traffic-by-app-name':
				return '{{APPNAME}}';
			case 'traffic-by-os':
				return '{{OS}}';
			case 'traffic-by-room':
				return '{{ROOM}}';
			case 'traffic-by-vendor':
				return '{{VENDOR}}';
			case 'traffic-by-room':
				return '{{ROOM}}';
			default:
				return '{{ELLIPEE}}';
		}
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				this.startTime = res.start;
				this.endTime = res.end;
				this.duration = res.short;
				this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}
	getData() {
		this.currentView == 'all' ? this.getAllData() : this.getFilterData();
	}
	// getFilterData() {
	// 	let url = this.item.query[0].spec.filtered_data_url;
	// 	let REPLACE = this.queryName();
	// 	url = this.replace(url, '+', '%2B');
	// 	url = this.replace(url, REPLACE, `"${this._filter}"`);
	// 	url = this.replace(url, REPLACE, `"${this._filter}"`);
	// 	url = this.replace(url, '{{startTime}}', `${this.startTime}`);
	// 	url = this.replace(url, '{{endTime}}', `${this.endTime}`);
	// 	url = this.replace(url, '{{DURATION}}', `${this.duration}`);
	// 	url = this.replace(url, '{{DURATION}}', `${this.duration}`);
	// 	url = this.replace(url, '{{step}}', `${this.step}`);
	// 	this.pending = true;
	// 	this.panelService.getPanelData(url).subscribe(
	// 		(res: any) => {
	// 			let data = res.data.result;
	// 			let column = [];
	// 			for (let key in data[0].metric) {
	// 				column.push(key);
	// 			}
	// 			console.log(column);
	// 			this.displayedColumns = column;
	// 			this.dataSource = data.map((result) => result.metric);

	// 			console.log(data.map((result) => result.metric));
	// 		},
	// 		(error) => {
	// 			this.pending = false;
	// 		}
	// 	);
	// }
	getFilterData() {
		console.log(this.item);
		console.log(this._excludeSegmentItemName);
		this.dataSource = [];
		this.dataSource = [];
		let subFilter = this.item.query.filter((itemQ) => itemQ.spec.title === this._excludeSegmentItemName);
		let numberOfCalls = subFilter.length;
		for (let index = 0; index < numberOfCalls; index++) {
			// if (this._excludeSegmentItemName == this.item.query[index].spec.title) {
			// 	continue;
			// }
			let url = subFilter[index].spec.filtered_data_url;
			console.log(url);
			let name = subFilter[index].metadata.name;
			let REPLACE = this.queryName(name);
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, REPLACE, `"${this._excludeSegmentItemName}"`);
			url = this.replace(url, REPLACE, `"${this._excludeSegmentItemName}"`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
			url = this.replace(url, '{{STEP}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					console.log(res);
					let data = res.data.result;
					let column = [];
					for (let key in data[0].metric) {
						column.push(key);
					}
					// this.displayedColumns = [ ...column ];
					this.dataSource = [ ...data.map((result) => result.metric) ];
					// if (index + 1 == numberOfCalls) {
					// 	setTimeout(() => {
					// 		this.pending = false;
					// 	}, 1000);
					// }
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}
	getAllData() {
		let url =
			this.item.type.metadata.name == 'summary-bar'
				? this.item.query[2].spec.all_data_url
				: this.item.query[0].spec.all_data_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{startTime}}', `${this.startTime}`);
		url = this.replace(url, '{{endTime}}', `${this.endTime}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{step}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				let data = res.data.result;
				let column = [];
				for (let key in data[0].metric) {
					column.push(key);
				}
				console.log(column);
				this.displayedColumns = column;
				this.dataSource = data.map((result) => result.metric);

				console.log(data.map((result) => result.metric));
			},
			(error) => {
				this.pending = false;
			}
		);
	}

	ngOnDestroy(): void {
		// this.themeSubscription.unsubscribe();
	}
}
