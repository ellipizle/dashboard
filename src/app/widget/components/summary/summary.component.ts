import { Component, OnInit, AfterViewInit, HostListener, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget } from '../../interfaces/widget';
@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: [ './summary.component.scss' ]
})
export class SummaryComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	pending: boolean;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.cd.detectChanges();
	}
	value = 80;
	// bufferValue = 100;
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	duration;
	step: any = 1;
	url: any;

	echartsInstance: ECharts;

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
				console.log('In summary');
				this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		this.seriesData = [];
		let numberOfCalls = this.item.query.length;
		for (let index = 0; index < numberOfCalls; index++) {
			let url = this.item.query[index].spec.base_url;
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{startTime}}', `${this.startTime}`);
			url = this.replace(url, '{{endTime}}', `${this.endTime}`);
			url = this.replace(url, '{{step}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					res.data['name'] = this.item.query[index].spec.title;
					this.seriesData.push(res.data);
					if (index + 1 == numberOfCalls) {
						setTimeout(() => {
							console.log(this.seriesData);
							// this.drawChart(this.formatSeries(this.seriesData));
							this.pending = false;
						}, 1000);
					}
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}

	formatSeries(array) {
		let dateList: Array<any> = [];
		let series: Array<any> = [];
		let legends: Array<any> = [];
		let length = array.length;
		for (let index = 0; index < length; index++) {
			let results = array[index].result;
			let name = array[index].name;
			legends.push(name);
			results.forEach((result, i) => {
				if (i == 0) {
					dateList = result.values.map((date) => date[0]);
				}
				const seriesData = result.values.map((date) => date[1]);
				series.push({
					stack: 'Total amount',
					type: 'line',
					name: name,
					areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
					data: seriesData
				});
			});
		}

		return { dateList: dateList, series: series, legend: legends };
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
