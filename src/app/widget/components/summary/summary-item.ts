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
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget, Query } from '../../interfaces/widget';
import { forkJoin } from 'rxjs';
@Component({
	selector: 'app-summary-item',
	template: `
	<div class="summary-container">
	          <h3 class="example-h2">{{data?.name}}</h3>
              <h2>{{data?.result[0]?.value[1] | round}}</h2>

              <section class="example-section">
                <mat-progress-bar
                    class="example-margin"
                    [value]="data?.result[0]?.value[1]">
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
			.summary-container{
				cursor:pointer
			}
			.summary {
				padding: 16px;
			}
			.mat-progress-bar {
				height: 22px;
			}

			.item{
				color:#8f9bb3
			}
	`
	]
})
export class SummaryItemComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Input() public query: Query;
	@Output() filter: EventEmitter<any> = new EventEmitter();
	changeRate: string;
	pending: boolean;
	finish: boolean;
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
	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService,
		private panelService: PanelService,
		private timerService: TimerService
	) {
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
		console.log(this.item);
		console.log(this.step);
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
		console.log('PREV_URL', prev_url);
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{STARTTIME}}', `${this.startTime}`);
		prev_url = this.replace(prev_url, '{{ENDTIME}}', `${this.endTime}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		this.finish = false;
		forkJoin(this.panelService.getPanelData(url), this.panelService.getPanelData(prev_url)).subscribe(
			(res: any) => {
				console.log(res);
				this.data = res[0].data;
				let currentData = res[0].data;
				let previousData = res[1].data;
				console.log(Math.round(currentData.result[0].value[1]) - Math.round(previousData.result[0].value[1]));
				let change = Math.round(currentData.result[0].value[1]) - Math.round(previousData.result[0].value[1]);
				this.changeRate =
					change < 0
						? `Decreased by ${Math.abs(change)}% ${this.duration} ago`
						: `Increased by ${change}% ${this.duration} ago`;

				// res.data['name'] = this.query.spec.title;
				// this.seriesData.push(res.data);
				// this.finish = true;
				// this.pending = false;
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
