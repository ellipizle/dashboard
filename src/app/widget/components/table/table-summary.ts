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
	selector: 'app-table-summary',
	template: `
	<div class="table-container mat-elevation-z8">
  <mat-table #table [dataSource]="dataSource">
    <ng-container [matColumnDef]="col" *ngFor="let col of displayedColumns">
      <mat-header-cell *matHeaderCellDef> {{ col }} </mat-header-cell>
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

	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getAllData();
		}
	}

	_excludeSegmentItemID: string;
	_excludeSegmentItemName: string;
	_filter: string;
	displayedColumns = [];
	dataSource: any = [];
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
				// this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}
	getData() {
		this.currentView == 'all' ? this.getAllData() : this.getFilterData();
	}
	getFilterData() {
		console.log(this.item.query);
		console.log(this._excludeSegmentItemName);
		this.dataSource = [];
		this.dataSource = [];
		let subFilter = this.item.query.filter((itemQ) => itemQ.spec.title === this._excludeSegmentItemName);
		let url = subFilter[0].spec.all_data_url;
		console.log(url);
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
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
				this.displayedColumns = [ ...column ];
				this.dataSource = [ ...this.dataSource, ...data.map((result) => result.metric) ];
			},
			(error) => {
				this.pending = false;
			}
		);
	}
	getAllData() {
		console.log(this.item);
		console.log(this.step);
		let numberOfCalls = this.item.query.length;
		for (let index = 0; index < numberOfCalls; index++) {
			let url = this.item.query[index].spec.all_data_url;
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
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
					this.displayedColumns = [ ...column ];
					this.dataSource = [ ...this.dataSource, ...data.map((result) => result.metric) ];
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}

	ngOnDestroy(): void {
		// this.themeSubscription.unsubscribe();
	}
}
