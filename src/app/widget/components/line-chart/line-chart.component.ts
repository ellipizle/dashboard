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
import { Subject } from 'rxjs';
const moment = _moment;
@Component({
	selector: 'app-line-chart',
	templateUrl: './line-chart.component.html',
	styleUrls: [ './line-chart.component.scss' ]
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getData();
		}
	}
	@Input() public item: Widget;
	@Output() filter: EventEmitter<any> = new EventEmitter();
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
			if (this.seriesData) {
				this.drawLine(this.formatSeries(this.seriesData));
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
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					res.data['name'] = this.item.query[index].spec.title;
					this.seriesData.push(res.data);
					if (index + 1 == numberOfCalls) {
						setTimeout(() => {
							this.drawLine(this.formatSeries(this.seriesData));
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
				const seriesData = result.values.map((date) => Math.round(date[1] / 1048576));
				series.push({
					type: 'line',
					name: name,
					data: seriesData,
					lineStyle: {
						width: 3
					}
				});
			});
		}

		return { dateList: dateList, series: series, legend: legends };
	}

	drawLine(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;

		this.options = {
			backgroundColor: echarts.bg,
			color: [
				colors.primaryLight,
				colors.successLight,
				colors.dangerLight,
				colors.infoLight,
				colors.warningLight
			],

			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					let string = `	${params[0].axisValueLabel} <br/>`;
					params.forEach((param) => {
						string += `${param.seriesName} : ${param.value} MB <br/>`;
					});
					return string;
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
				top: '4%',
				left: '3%',
				right: '7%',
				bottom: '13%',
				containLabel: true
			},
			xAxis: [
				{
					// name: 'Date',
					nameTextStyle: {
						align: 'left'
					},
					type: 'category',
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
					// name: 'Megabyte',
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
					axisPointer: {
						label: {
							formatter: function(value) {
								let fmt = Math.round(value.value);
								return `${fmt} MB`;
							}
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
