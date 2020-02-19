import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget } from '../../interfaces/widget';
import { data } from 'time-series';
import * as _moment from 'moment';
import { combineLatest } from 'rxjs/operators';
const moment = _moment;
@Component({
	selector: 'app-area-stack',
	templateUrl: './area-stack.component.html',
	styleUrls: [ './area-stack.component.scss' ]
})
export class AreaStackComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	pending: boolean;

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
		});
		// 	combineLatest(
		// 	this.timerService.dateRange$,
		// 	this.timerService.refresh$,
		// 	this.timerService.timer$
		// ).subscribe((res: any) => {
		// 	if (res[0]) {
		// 	}
		// 	if (res[1]) {
		// 		this.getData();
		// 	}

		// 	if (res[2]) {
		// 		let self = this;
		// 		if (typeof res[2] === 'number') {
		// 			this.interval = window.setInterval(function() {
		// 				// console.log('hello timer');
		// 				self.getData();
		// 			}, res[2]);
		// 		} else {
		// 			window.clearInterval(this.interval);
		// 		}
		// 	}
		// });

		this.timerService.getRefreshObs().subscribe((res) => {
			if (res) {
				console.log('refresh called');
				this.getData();
			}
		});
		this.timerService.getIntervalObs().subscribe((res) => {
			let self = this;
			console.log('interval called');
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
		// this.drawChart(this.formatSeries(data.data));
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				console.log('date range called');
				this.startTime = res.start;
				this.endTime = res.end;
				this.step = res.step;
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
				this.drawChart(this.formatSeries(res.data));
				this.pending = false;
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
				areaStyle: { normal: { opacity: this.echarts.areaOpacity } },
				data: valueList
			});
		});
		return { dateList: dateList, series: series };
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
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: echarts.tooltipBackgroundColor
					}
				}
			},
			grid: {
				top: '4%',
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			xAxis: [
				{
					// type: 'category',
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
							return moment.unix(time).format('d/M/Y, h:mm');
						},
						textStyle: {
							color: echarts.textColor
						}
					},
					axisPointer: {
						label: {
							formatter: function(axisValue) {
								return moment.unix(axisValue.value).format('d/M/Y, h:mm');
							}
						}
					}
				}
			],
			yAxis: [
				{
					type: 'value',
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
