import {
	Component,
	Output,
	EventEmitter,
	AfterViewInit,
	HostListener,
	ChangeDetectorRef,
	Input,
	OnDestroy,
	ElementRef
} from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { TimerService } from '../../../shared/services/timer.service';
import { PanelService } from '../../../shared/services/panel.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { data } from 'pie';
import * as _moment from 'moment';
import { combineLatest } from 'rxjs/operators';
const moment = _moment;
@Component({
	selector: 'app-bar-animation',
	templateUrl: './bar-animation.component.html',
	styleUrls: [ './bar-animation.component.scss' ]
})
export class BarAnimationComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Output() filter: EventEmitter<any> = new EventEmitter();
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}

	startTime: any = 1581722395;
	endTime: any = 1581723395;
	duration: any = 1581722395;
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
				this.drawBar(this.formatSeries(this.seriesData));
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
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	onChartClick(event: any, type: string) {
		console.log('chart event:', type, event);
		this.filter.emit(event['name']);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				this.startTime = res.start;
				this.endTime = res.end;
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
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
			url = this.replace(url, '{{STEP}}', `${this.step}`);
			url = this.replace(url, '{{STEP}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					res.data['name'] = this.item.query[index].spec.title;
					this.seriesData.push(res.data);
					if (index + 1 == numberOfCalls) {
						setTimeout(() => {
							this.drawBar(this.formatSeries(this.seriesData));
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
				const seriesData = result.values.map((date) => Math.round(date[1]));
				series.push({
					type: 'bar',
					name: name,
					animationDelay: (idx) => idx * 10 + (index + 1 * 100),
					data: seriesData
				});
			});
		}
		return { dateList: dateList, data: series, legend: legends };
	}

	// formatSeries(data) {
	// 	let legend: string;
	// 	let results = data.result;
	// 	let dateList: Array<any> = [];
	// 	let dataArray: Array<any> = [];
	// 	results.forEach((result, index) => {
	// 		let name: string;
	// 		let metric = result.metric;
	// 		for (let key in metric) {
	// 			legend = key;
	// 			name = metric[key];
	// 		}
	// 		dateList.push(name);
	// 		dataArray.push({
	// 			name: name,
	// 			type: 'bar',
	// 			data: result.value,
	// 			animationDelay: (idx) => idx * 10 + (index + 1 * 100)
	// 		});
	// 	});
	// 	return { dateList: dateList, data: dataArray, legend: legend };
	// }

	drawBar(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;

		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.primaryLight, colors.infoLight ],
			legend: {
				data: data.legend,
				textStyle: {
					color: echarts.textColor
				}
			},
			xAxis: [
				{
					// name: this.item.query[0].spec.x_axis_label,
					data: data.dateList,
					silent: false,
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
			series: data.data,
			animationEasing: 'elasticOut',
			animationDelayUpdate: (idx) => idx * 5
		};
	}

	drawAnimatedBar(data) {
		console.log(data);
		const xAxisData = [];
		const data1 = [];
		const data2 = [];
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.primaryLight, colors.infoLight ],
			legend: {
				data: [ 'bar', 'bar2' ],
				align: 'left',
				textStyle: {
					color: echarts.textColor
				}
			},
			xAxis: [
				{
					data: xAxisData,
					silent: false,
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						lineStyle: {
							color: echarts.axisLineColor
						}
					},
					axisLabel: {
						textStyle: {
							color: echarts.textColor
						}
					}
				}
			],
			yAxis: [
				{
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
			series: [
				{
					name: 'bar',
					type: 'bar',
					data: data1,
					animationDelay: (idx) => idx * 10
				},
				{
					name: 'bar2',
					type: 'bar',
					data: data2,
					animationDelay: (idx) => idx * 10 + 100
				}
			],
			animationEasing: 'elasticOut',
			animationDelayUpdate: (idx) => idx * 5
		};

		for (let i = 0; i < 100; i++) {
			xAxisData.push('Category ' + i);
			data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
			data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
		}
		console.log(xAxisData);
		console.log(data1);
		console.log(data2);
	}
	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
