import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy,
	HostListener
} from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { data } from 'pie';
import * as _moment from 'moment';
const moment = _moment;
@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: [ './line-chart.component.scss' ]
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;

	startTime: any = 1581722395;
	endTime: any = 1581723395;
	step: any = 15;
	url: any;

	echartsInstance: ECharts;

	themeSubscription: any;
	options: any = {};
	colors: any;
	echarts: any;
	interval;
	pending: boolean;
	chartData;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}
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
			if (this.chartData) {
				this.drawLine(this.formatSeries(this.chartData));
			}
		});

		// this.timerService.getDateRangeObs().subscribe((res: any) => {
		// 	if (res) {
		// 		console.log('date range called');
		// 		this.startTime = res.start;
		// 		this.endTime = res.end;
		// 		this.getData();
		// 	}
		// });

		this.timerService.getRefreshObs().subscribe((res) => {
			if (res) {
				this.getData();
			}
		});

		this.timerService.getIntervalObs().subscribe((res) => {
			let self = this;
			if (typeof res === 'number') {
				this.interval = window.setInterval(function() {
					// console.log('hello timer');
					self.getData();
				}, res);
			} else {
				window.clearInterval(this.interval);
			}
		});
	}
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				console.log('date range called');
				this.startTime = res.start;
				this.endTime = res.end;
				// this.step = res.step;
				this.step = 480;
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		let url = this.item.query.spec.base_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{startTime}}', `${this.startTime}`);
		url = this.replace(url, '{{endTime}}', `${this.endTime}`);
		url = this.replace(url, '{{step}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				this.pending = false;
				this.drawLine(this.formatSeries(res.data));
			},
			(error) => {
				this.pending = false;
			}
		);
	}
	formatSeries(data) {
		let results = data.result;
		let dateList: Array<any> = [];
		let series: Array<any> = [];
		results.forEach((result, index) => {
			if (index == 0) {
				dateList = result.values.map((date) => date[0]);
			}
			const valueList = result.values.map((date) => date[1]);
			series.push({
				type: 'line',
				name: this.item.query.metadata.name,
				// areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
				data: valueList
			});
		});
		return { dateList: dateList, series: series };
	}

	drawLine(data) {
		console.log(data);
		const colors: any = this.colors;
		const echarts: any = this.echarts;

		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.danger, colors.primary, colors.info ],
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c}'
			},
			// legend: {
			// 	left: 'left',
			// 	data: [ 'Line 1', 'Line 2', 'Line 3' ],
			// 	textStyle: {
			// 		color: echarts.textColor
			// 	}
			// },
			grid: {
				top: '4%',
				left: '3%',
				right: '14%',
				bottom: '13%',
				containLabel: true
			},
			xAxis: [
				{
					name: this.item.query.spec.x_axis_label,
					// type: 'category',
					data: data.dateList,
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						lineStyle: {
							color: echarts.axisLineColor
						}
					},
					axisLabel: {
						formatter: function(time) {
							return moment.unix(time).format('d/M/Y, h:mm');
						},
						textStyle: {
							color: echarts.textColor
						}
					}
				}
			],
			yAxis: [
				{
					type: 'log',
					axisLine: {
						lineStyle: {
							color: echarts.axisLineColor
						}
					},
					splitLine: {
						lineStyle: {
							color: echarts.splitLineColor
						}
					},
					axisLabel: {
						textStyle: {
							color: echarts.textColor
						}
					}
				}
			],
			series: data.series
		};
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
