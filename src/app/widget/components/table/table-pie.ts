import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy,
	ViewChild
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
	selector: 'app-table-pie',
	template: `
	<div class="table-container mat-elevation-z8">
	    <div class="view-header">
      <div class="field">
    <mat-form-field appearance="outline">
      <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
    </mat-form-field>
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
export class TablePieComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input() public item: Widget;
	@Input('filter')
	set filter(obj: Object) {
		if (obj && obj !== 'undefined') {
			let name = obj['name'];
			let query = obj['filters'];
			let array = [];
			for (let key in query) {
				if (query[key] == true) {
					array.push(key);
				}
			}
			this._excludeSegmentItemName = [ ...array ];
			this.dataSource = new MatTableDataSource(
				this.dataGrid.filter((itemQ) => this._excludeSegmentItemName.includes(itemQ[name]))
			);
		}
	}

	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getAllData();
		}
	}

	_excludeSegmentItemID: string;
	_excludeSegmentItemName: Array<string> = [];
	_filter: string;
	displayedColumns = [];
	dataSource: any = new MatTableDataSource([]);
	rootSource: any = new MatTableDataSource([]);
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
	//   dataSource = new MatTableDataSource(2);
	dataGrid = [];
	@ViewChild(MatSort) sort: MatSort;

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
	ngAfterViewInit() {
		this.dataSource.filterPredicate = (data: any, filter: string) => {
			for (let key in data) {
				return data[key].toLowerCase().includes(filter);
			}
		};

		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res && this.item) {
				this.startTime = res.start;
				this.endTime = res.end;
				this.duration = res.short;
				this.step = Math.round(
					(res.end - res.start) / this.item.type.spec.panel_datapoint_count
						? this.item.type.spec.panel_datapoint_count
						: 1
				);
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
		this.dataSource = [];
		let subFilter = this.item.query.filter((itemQ) => this._excludeSegmentItemName.includes(itemQ.spec.title));

		let numberOfCalls = subFilter.length;
		for (let index = 0; index < numberOfCalls; index++) {
			// if (this._excludeSegmentItemName == this.item.query[index].spec.title) {
			// 	continue;
			// }
			let url = subFilter[index].spec.filtered_data_url;
			let name = subFilter[index].metadata.name;
			let REPLACE = this.queryName(name);

			url = this.replace(url, '+', '%2B');
			url = this.replace(url, REPLACE, `"${subFilter[index].spec.title}"`);
			url = this.replace(url, REPLACE, `"${subFilter[index].spec.title}"`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
			url = this.replace(url, '{{STEP}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					let data = res.data.result;
					let column = [];
					for (let key in data[0].metric) {
						column.push(key);
					}
					let arr = [ ...this.dataSource, ...data.map((result) => result.metric) ];
					this.rootSource = new MatTableDataSource(arr);
					this.dataSource = new MatTableDataSource(arr);
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}
	getAllData() {}
	getAllDxata() {
		console.log(this.item);
		this.dataGrid = [];
		if (this.item && this.item.query.length > 0) {
			let url = this.item.query[0].spec.all_data_url;
			if (url === 'undefined') {
				return;
			}
			console.log(url);
			console.log(this.duration);
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
					this.displayedColumns = column;
					let arr = [ ...this.dataGrid, ...data.map((result) => result.metric) ];
					this.dataGrid = arr;
					this.dataSource = new MatTableDataSource(arr);
					this.dataSource.sort = this.sort;
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
