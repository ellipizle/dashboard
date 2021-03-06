import {
	Component,
	OnInit,
	Output,
	EventEmitter,
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
import { Widget } from '../../interfaces/widget';
import { data } from 'time-series';
import * as _moment from 'moment';
import { combineLatest } from 'rxjs/operators';
import { Subject } from 'rxjs';
const moment = _moment;
@Component({
	selector: 'app-area-stack',
	templateUrl: './area-stack.component.html',
	styleUrls: [ './area-stack.component.scss' ]
})
export class AreaStackComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: string) {
		if (data && this.item) {
			console.log(this.item);
			console.log('getting data');
			this.getData();
		}
	}
	@Input() public item: Widget;
	@Input() public index: any;
	@Output() filter: EventEmitter<any> = new EventEmitter();
	pending: boolean;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}
	duration: string = '';
	startTime: any = 1581722395;
	endTime: any = 1581723395;
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
	sementChar = {};
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
				this.drawChart(this.formatSeries(this.seriesData));
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
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	onChartLegendSelected(event: any, type: string) {
		this.filter.emit(event['selected']);
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				this.duration = res.short;
				this.startTime = res.start;
				this.endTime = res.end;
				this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		// console.log('1');
		// console.log(this.startTime);
		// console.log(this.endTime);
		this.seriesData = [];
		let numberOfCalls = this.item.query.length;
		for (let index = 0; index < numberOfCalls; index++) {
			let url = this.item.query[index].spec.query_info.base_url;
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
			url = this.replace(url, '{{STEP}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					res.data['name'] = this.item.query[index].spec.query_info.title;
					this.seriesData.push(res.data);
					if (index + 1 == numberOfCalls) {
						setTimeout(() => {
							this.drawChart(this.formatSeries(this.seriesData));
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
			this.sementChar[name];
			legends.push(name);
			results.forEach((result, i) => {
				if (i == 0) {
					dateList = result.values.map((date) => Math.round(date[0]));
				}
				const seriesData = result.values.map((date) => Math.round(date[1] / 1048576));
				series.push({
					stack: 'Total amount',
					type: 'line',
					name: name,
					areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
					data: seriesData,
					tooltip: {
						formatter: '{b0}: {c0}<br />blackssd {b1}: {c1}'
					}
				});
			});
		}

		return { dateList: dateList, series: series, legend: legends };
	}

	drawChart(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		this.options = {
			backgroundColor: echarts.bg,
			color: [
				colors.warningLight,
				colors.infoLight,
				colors.dangerLight,
				colors.successLight,
				colors.primaryLight
			],
			tooltip: {
				trigger: 'axis',

				formatter: function(params) {
					console.log(params);
					let string = `	${params[0].axisValueLabel} <br/>`;
					params.forEach((param) => {
						string += `${param.seriesName} : ${param.value} MB <br/>`;
					});
					return string;

					// If axis.type is 'time'
					// return 'some text' + echarts.format.formatTime(params.value);
				},
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: echarts.tooltipBackgroundColor
					}
				}
			},
			legend: {
				data: data.legend,
				textStyle: {
					color: echarts.textColor
				}
			},
			grid: {
				top: '16%',
				left: '3%',
				right: '7%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					// name: 'Date',
					nameTextStyle: {
						align: 'left'
					},
					type: 'category',
					boundaryGap: false,
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
							return moment.unix(time).format('M/D/Y, h:mm a');
						},
						textStyle: {
							color: echarts.textColor
						}
					},
					axisPointer: {
						label: {
							formatter: function(axisValue) {
								return moment.unix(axisValue.value).format('M/D/Y, h:mm a');
							}
						}
					}
				}
			],
			yAxis: [
				{
					nameTextStyle: {
						align: 'right'
					},
					type: 'value',
					interval: 20,
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
						show: true,
						formatter: function(value) {
							return `${value} MB`;
						},
						textStyle: {
							color: echarts.textColor
						}
					},
					axisPointer: {
						show: true,
						label: {
							formatter: function(value) {
								let fmt = Math.round(value.value);
								return `${fmt} MB`;
							}
						}
					}
				}
			],
			series: data.series
		};
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
