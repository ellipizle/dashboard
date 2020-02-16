import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget } from '../../interfaces/widget';
import { data } from 'time-series';
import * as _moment from 'moment';
const moment = _moment;
@Component({
	selector: 'app-area-stack',
	templateUrl: './area-stack.component.html',
	styleUrls: [ './area-stack.component.scss' ]
})
export class AreaStackComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Input() public index: any;
	@Input() public data: any;
	@Input() public unitHeight: number;

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
		// this.drawChart(this.formatSeries(data.data));
		this.getData();
	}

	getData() {
		let url = this.item.query.spec.base_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{startTime}}', `${this.startTime}`);
		url = this.replace(url, '{{endTime}}', `${this.endTime}`);
		url = this.replace(url, '{{step}}', `${this.step}`);
		this.panelService.getPanelData(url).subscribe((res: any) => {
			this.drawChart(this.formatSeries(res.data));
		});
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
							var date = new Date(time);
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
