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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import * as _moment from 'moment';
const moment = _moment;
@Component({
	selector: 'app-table-summary-chart',
	template: `
	<div class="table-container mat-elevation-z8">
	    <div class="view-header">
     	 <div class="field">
			<mat-form-field appearance="outline">
			<input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
			</mat-form-field>
		</div>
		<div class="field table-toggle">
			<mat-slide-toggle [(ngModel)]="showAgoData" (change)="onToggleData($event.checked)">Show {{duration}} ago data</mat-slide-toggle>
		</div>
  </div>
  <mat-table #table [dataSource]="dataSource" matSort>
    <ng-container [matColumnDef]="col" *ngFor="let col of displayedColumns">
      <mat-header-cell *matHeaderCellDef mat-sort-header> {{ col }} </mat-header-cell>
      <mat-cell *matCellDef="let element"> {{ element[col] }} </mat-cell>
    </ng-container>
    <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
    <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
  </mat-table>
</div>
	`,
	styleUrls: [ './table.component.scss' ]
})
export class TableSummaryChartComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	showAgoData: boolean;
	@Input() public item: Widget;
	@Input('filter')
	set filter(query: any) {
		this.dataSource = new MatTableDataSource([]);
		if (query && query.name == 'filter') {
			this.currentView = 'filter';
			this._excludeSegmentItemID = query.filters;
			if (this.isShowTable) {
				this.getFilterData();
			}
		} else if (query && query.name == 'all') {
			this.isShowTable = query.filter;
			if (this.isShowTable) {
				this.getAllData();
			}
		}
	}

	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			// this.isShowTable = true;
			if (this.isShowTable) {
				this.getAllData();
			}
		} else {
			this.dataSource = new MatTableDataSource([]);
		}
	}

	_excludeSegmentItemID: string;
	filterObject = {};
	_excludeSegmentItemName: Array<any> = [];

	_filter: string;
	displayedColumns = [];
	rootDatasource: any = [];
	dataSource: any = new MatTableDataSource([]);
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	step: any = 50;
	currentView: string = 'all';
	pending: boolean;
	themeSubscription: any;
	options: any = {};
	colors: any;
	echarts: any;
	interval;
	duration;
	isShowTable;

	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private panelService: PanelService,
		private timerService: TimerService
	) {
		this.timerService.getRefreshObs().subscribe((res) => {
			if (res) {
				if (this._excludeSegmentItemID || this.isShowTable) {
					this.getData();
				}
			}
		});
		this.timerService.getIntervalObs().subscribe((res) => {
			let self = this;
			if (typeof res === 'number') {
				window.clearInterval(this.interval);
				this.interval = window.setInterval(function() {
					if (self._excludeSegmentItemID || self.isShowTable) {
						self.getData();
					}
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
	onToggleData(event) {
		if (this.isShowTable) {
			this.getAllData();
		}
	}
	ngAfterViewInit() {
		this.dataSource.filterPredicate = (data: any, filter: string) => {
			for (let key in data) {
				return data[key].toLowerCase().includes(filter);
			}
		};
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				this.startTime = res.start;
				this.endTime = res.end;
				this.duration = res.short;
				// this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				if (this._excludeSegmentItemID || this.isShowTable) {
					this.getData();
				}
			}
		});
		this.cd.detectChanges();
	}
	getData() {
		console.log('twiste');
		this.currentView == 'all' ? this.getAllData() : this.getFilterData();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	getFilterData() {
		console.log(this._excludeSegmentItemName);
		console.log(this.item.query);
		// console.log(this._excludeSegmentItemName);
		this.rootDatasource = [];
		this.dataSource = new MatTableDataSource([]);
		let url = this.item.query[0].spec.query_info.filtered_data_url;
		let t = moment.utc().unix() - moment.unix(parseInt(this._excludeSegmentItemID)).utc().unix();
		let min = Math.round(t / 60);
		url = this.replace(url, '{{OFFSET_IN_MIN}}', `${min}`);
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				let data = res.data.result;
				let column = [];
				for (let key in data[0].metric) {
					column.push(key);
				}
				this.displayedColumns = [ ...column ];
				this.rootDatasource = [ ...this.rootDatasource, ...data.map((result) => result.metric) ];

				this.dataSource = new MatTableDataSource(this.rootDatasource);
			},
			(error) => {
				this.pending = false;
			}
		);
	}
	getAllData() {
		console.log('in all data');
		console.log(this.item);
		this.dataSource = new MatTableDataSource([]);
		this.rootDatasource = [];
		this.filterObject = {};
		let numberOfCalls = this.item.query.length;
		// for (let index = 0; index < numberOfCalls; index++) {
		let url = this.showAgoData
			? this.item.query[0].spec.query_info.prev_data_url
			: this.item.query[0].spec.query_info.all_data_url;
		let localObj = {};
		let name = this.item.query[0].spec.query_info.title;
		localObj[name] = true;
		this.filterObject = { ...this.filterObject, ...localObj };
		// url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				let data = res.data.result;
				let column = [];
				if (data && data.length > 0) {
					for (let key in data[0].metric) {
						column.push(key);
					}
					this.displayedColumns = [ ...column ];
					this.rootDatasource = [ ...this.rootDatasource, ...data.map((result) => result.metric) ];
					this.dataSource = new MatTableDataSource(this.rootDatasource);
					// this.dataSource = new MatTableDataSource([]);
				}
			},
			(error) => {
				this.pending = false;
			}
		);
		// }
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		// this.themeSubscription.unsubscribe();
	}
}
