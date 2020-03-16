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
@Component({
	selector: 'app-table-summary',
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
export class TableSummaryComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	showAgoData: boolean;
	@Input() public item: Widget;
	@Input('filter')
	set filter(query: any) {
		if (query) {
			this.filterObject = { ...this.filterObject, ...query };
			let array = [];
			let filterObj = this.filterObject;
			for (let key in filterObj) {
				if (filterObj[key] == false) {
					array.push(key);
				}
			}
			console.log('set');
			this._excludeSegmentItemName = [ ...array ];
			this.getFilterData();
		}
	}

	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getAllData();
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
				this.getData();
			}
		});
		this.timerService.getIntervalObs().subscribe((res) => {
			let self = this;
			if (typeof res === 'number') {
				window.clearInterval(this.interval);
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
	onToggleData(event) {
		console.log(event);
		this.getFilterData();
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
				this.getData();
			}
		});
		this.cd.detectChanges();
	}
	getData() {
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
		let subFilter = this.item.query.filter((itemQ) => this._excludeSegmentItemName.includes(itemQ.spec.title));
		let numberOfCalls = subFilter.length;
		for (let index = 0; index < numberOfCalls; index++) {
			let url = this.showAgoData ? subFilter[index].spec.prev_data_url : subFilter[index].spec.all_data_url;
			// url = this.replace(url, '+', '%2B');
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
					for (let key in data[0].metric) {
						column.push(key);
					}
					console.log(index);
					this.rootDatasource = [ ...this.rootDatasource, ...data.map((result) => result.metric) ];
					console.log(this.rootDatasource);
					this.dataSource = new MatTableDataSource(this.rootDatasource);
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}
	getAllData() {
		this.rootDatasource = [];
		this.filterObject = {};
		let numberOfCalls = this.item.query.length;
		for (let index = 0; index < numberOfCalls; index++) {
			let url = this.item.query[index].spec.all_data_url;
			let localObj = {};
			let name = this.item.query[index].spec.title;
			localObj[name] = true;
			this.filterObject = { ...this.filterObject, ...localObj };
			url = this.replace(url, '+', '%2B');
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
						// this.dataSource = new MatTableDataSource(this.rootDatasource);
						this.dataSource = new MatTableDataSource([]);
					}
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
		// this.themeSubscription.unsubscribe();
	}
}
