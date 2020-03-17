import {
	Component,
	EventEmitter,
	Output,
	OnInit,
	AfterViewInit,
	HostListener,
	ChangeDetectorRef,
	Input,
	OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget, Query } from '../../interfaces/widget';
import { forkJoin } from 'rxjs';
import { Subject } from 'rxjs';
@Component({
	selector: 'app-summary-item',
	template: `
	<div [ngClass]="{'summary-container': !detailView,'deactivated': !isActive}" (click)="onTableClick(data.name)">
							<div *ngIf="index === 0">
			  <h2 class="total-title">{{percentageData?.label}}: {{percentageData?.value| round}}</h2>

</div>
			  <h3 class="title">{{data?.name}}</h3>
						<div>
			  <h2 class="section title">{{data?.result[0]?.value[1] | round}}</h2>

</div>
              <section class="example-section">
                <mat-progress-bar
					class="example-margin"
					mode="determinate"
                    [value]="realValue">
                </mat-progress-bar>
			  </section>
			  <div class="item">{{changeRate}}</div>
</div>
	`,
	styles: [
		`
			h2,
			h3 {
				margin-bottom: 2px;
			}
			.total-title{
				text-align:center;
				font-size:1rem
			}
.summary-container {
	cursor: pointer;
	    margin: 10px 0px;
    padding: 0px 10px 0px 10px;
}
			.summary {
				padding: 16px;
			}
			.mat-progress-bar {
				height: 22px;
			}
.section{
	display:inline-block
}
.percentage{
	float:right
}
			.item{
				color:#8f9bb3
			}
			.deactivated{
				background:#c5cae9;
							h2,
			h3 {
				color:#9fa9be
			}
					.mat-progress-bar {
						background:#8f9bb3
			}
					.title{
						color:#9fa9be
					}
			}
	`
	]
})
export class SummaryItemComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	isActive: boolean = true;
	@Input() public item: Widget;
	@Input() public index: any;
	@Input() public query: Query;
	@Output() filter: EventEmitter<any> = new EventEmitter();
	changeRate: string;
	pending: boolean;
	detailView: boolean;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.cd.detectChanges();
	}
	value = 80;
	// bufferValue = 100;
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	duration: any = 1581722395;
	step: any = 15;
	url: any;

	echartsInstance: ECharts;
	data: any;
	themeSubscription: any;
	options: any = {};
	colors: any;
	echarts: any;
	interval;
	chartData;
	seriesData = [];
	legendData = [];
	xAxisData = [];
	realValue;
	percentageData;
	constructor(
		private route: Router,
		private location: Location,
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService,
		private panelService: PanelService,
		private timerService: TimerService
	) {
		this.route.events.subscribe((res) => {
			let url = this.location.path().split('/');
			if (url[2] && url[2] == 'panel') {
				this.detailView = true;
			} else {
				this.detailView = false;
			}
		});
		//get chart styles
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			this.colors = config.theme.variables;
			this.echarts = config.echart;
			if (this.seriesData) {
				// this.drawChart(this.formatSeries(this.seriesData));
			}
		});

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
	onTableClick($event) {
		this.isActive = !this.isActive;
		let data = {};
		data[$event] = this.isActive;
		this.filter.emit(data);
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
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
		this.seriesData = [];
		let url = this.query.spec.base_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		let prev_url = this.query.spec.prev_url;
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{STARTTIME}}', `${this.startTime}`);
		prev_url = this.replace(prev_url, '{{ENDTIME}}', `${this.endTime}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);

		let total_url = this.query.spec.total_url;
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{STARTTIME}}', `${this.startTime}`);
		prev_url = this.replace(prev_url, '{{ENDTIME}}', `${this.endTime}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		forkJoin(
			this.panelService.getPanelData(url),
			this.panelService.getPanelData(prev_url),
			this.panelService.getPanelData(total_url)
		).subscribe(
			(res: any) => {
				res[0].data['name'] = this.query.spec.title;
				this.data = res[0].data;
				if (this.index == 0) {
					let percentage = {};
					percentage['value'] = res[2].data.result[0].value[1];
					percentage['label'] = this.query.spec.total_label;
					this.percentageData = percentage;
				}

				let currentData = res[0].data;
				let previousData = res[1].data;
				let totalData = res[2].data;
				this.realValue =
					parseInt(currentData.result[0].value[1]) / parseInt(totalData.result[0].value[1]) * 100;
				let change = Math.round(currentData.result[0].value[1]) - Math.round(previousData.result[0].value[1]);
				this.changeRate =
					change < 0
						? `Decreased by ${Math.abs(change)} from ${this.duration} ago`
						: `Increased by ${change} from ${this.duration} ago`;
			},
			(error) => {
				this.pending = false;
			}
		);
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
