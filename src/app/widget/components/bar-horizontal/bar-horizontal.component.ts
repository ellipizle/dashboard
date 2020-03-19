import {
	Component,
	EventEmitter,
	Output,
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
@Component({
	selector: 'app-bar-horizontal',
	templateUrl: './bar-horizontal.component.html',
	styleUrls: [ './bar-horizontal.component.scss' ]
})
export class BarHorizontalComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getData();
		}
	}
	@Input() public item: Widget;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}
	@Output() filter: EventEmitter<any> = new EventEmitter();
	pending: boolean;
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
	chartData;
	fieldName: string;
	private unitType: any;
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
				this.drawBar(this.formatSeries(this.chartData));
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
		let data = {};
		data['name'] = this.fieldName;
		data['filters'] = event['selected'];
		this.filter.emit(data);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				console.log('date range called');
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
		if (this.item && this.item.query.length > 0) {
			let url = this.item.query[0].spec.base_url;
			this.unitType = this.item.query[0].spec.units;
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{startTime}}', `${this.startTime}`);
			url = this.replace(url, '{{endTime}}', `${this.endTime}`);
			url = this.replace(url, '{{step}}', `${this.step}`);
			this.pending = true;
			this.panelService.getPanelData(url).subscribe(
				(res: any) => {
					console.log(res);
					this.chartData = res.data;
					this.pending = false;
					this.drawBar(this.formatSeries(res.data));
				},
				(error) => {
					this.pending = false;
				}
			);
		}
	}
	formatSeries(data) {
		let legend: string;
		let results = data.result;
		let xAxisList: Array<any> = [];
		let dataArray: Array<any> = [];
		results.forEach((result) => {
			let name: string;
			let metric = result.metric;
			for (let key in metric) {
				this.fieldName = key;
				legend = key;
				name = metric[key];
			}
			xAxisList.push(name);
			dataArray.push({
				name: name,
				type: 'bar',
				label: {
					color: this.echarts.textColor,
					show: true,
					position: 'left',
					formatter: '{a}'
				},
				// barWidth: '60%',
				data: [ this.unitType == 'bytes' ? Math.round(result.value[1] / 1048576) : Math.round(result.value[1]) ]
			});
		});
		return { xAxis: xAxisList, series: dataArray, legend: legend };
	}

	drawBar(data) {
		// console.log(this.item.query.spec.x_axis_label)
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		var self = this;
		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.primaryLight ],
			legend: {
				data: data.xAxisList,
				textStyle: {
					color: echarts.textColor
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				top: '16%',
				left: '10%',
				right: '7%',
				bottom: '5%',
				containLabel: true
			},
			yAxis: [
				{
					// name: data.legend,
					// nameTextStyle: {
					// 	align: 'left'
					// },
					type: 'category'
					// data: data.xAxis,
					// axisTick: {
					// 	alignWithLabel: true
					// },
					// axisLine: {
					// 	lineStyle: {
					// 		color: echarts.axisLineColor
					// 	}
					// },
					// axisLabel: {
					// 	textStyle: {
					// 		color: echarts.textColor
					// 	}
					// }
				}
			],
			xAxis: [
				{
					nameTextStyle: {
						align: 'right'
					},
					type: 'value',
					// interval: 20,
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
							formatter: (value) => {
								let fmt = Math.round(value.value);
								return self.unitType == 'bytes' ? `${fmt} MB` : `${fmt}`;
							}
						}
					},
					axisLabel: {
						show: true,
						formatter: (value) => {
							return self.unitType == 'bytes' ? `${value} MB` : `${value}`;
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
	}
}
