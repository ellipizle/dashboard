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
import { Subject } from 'rxjs';
import * as _moment from 'moment';
import { combineLatest } from 'rxjs/operators';
const moment = _moment;
@Component({
	selector: 'app-bar-animation',
	templateUrl: './bar-animation.component.html',
	styleUrls: [ './bar-animation.component.scss' ]
})
export class BarAnimationComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getData();
		}
	}
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
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	onChartClick(event: any, type: string) {
		this.filter.emit(event['selected']);
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
			let url = this.item.query[index].spec.query_info.base_url;
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
					res.data['name'] = this.item.query[index].spec.query_info.title;
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
				const seriesData = result.values.map((date) => Math.round(date[1] / 1048576));
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
			xAxis: [
				{
					// name: this.item.query[0].spec.x_axis_label,
					// name: 'Date',
					nameTextStyle: {
						align: 'left'
					},
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
			series: data.data,
			animationEasing: 'elasticOut',
			animationDelayUpdate: (idx) => idx * 5
		};
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
