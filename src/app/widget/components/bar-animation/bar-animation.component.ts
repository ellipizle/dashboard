import { Component, AfterViewInit, HostListener, ChangeDetectorRef, Input, OnDestroy, ElementRef } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { TimerService } from '../../../shared/services/timer.service';
import { PanelService } from '../../../shared/services/panel.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { data } from 'pie';
@Component({
	selector: 'app-bar-animation',
	templateUrl: './bar-animation.component.html',
	styleUrls: [ './bar-animation.component.scss' ]
})
export class BarAnimationComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}

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
				this.duration = res.short;
				this.step = res.step;
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		let url = this.item.query.spec.base_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{step}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				this.pending = false;
				this.drawBar(this.formatSeries(res.data));
			},
			(error) => {
				this.pending = false;
			}
		);
	}
	formatSeries(data) {
		let legend: string;
		let results = data.result;
		let dateList: Array<any> = [];
		let dataArray: Array<any> = [];
		results.forEach((result, index) => {
			let name: string;
			let metric = result.metric;
			for (let key in metric) {
				legend = key;
				name = metric[key];
			}
			dateList.push(name);
			// 	{
			// 	name: 'bar',
			// 	type: 'bar',
			// 	data: data1,
			// 	animationDelay: (idx) => idx * 10
			// },
			// {
			// 	name: 'bar2',
			// 	type: 'bar',
			// 	data: data2,
			// 	animationDelay: (idx) => idx * 10 + 100
			// }
			dataArray.push({
				name: name,
				type: 'bar',
				data: result.value,
				animationDelay: (idx) => idx * 10 + (index + 1 * 100)
			});
		});
		return { dateList: dateList, data: dataArray, legend: legend };
	}

	drawBar(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;

		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.primaryLight, colors.infoLight ],
			// legend: {
			// 	data: [ 'bar', 'bar2' ],
			// 	align: 'left',
			// 	textStyle: {
			// 		color: echarts.textColor
			// 	}
			// },
			xAxis: [
				{
					name: this.item.query.spec.x_axis_label,
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
