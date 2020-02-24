import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy
} from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { data } from 'pie';
@Component({
	selector: 'app-pie',
	templateUrl: './pie.component.html',
	styleUrls: [ './pie.component.scss' ]
})
export class PieComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Input() public index: any;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.echartsInstance.resize();
		this.cd.detectChanges();
	}
	duration: any = 1581722395;
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
				console.log('in style');
				console.log(config.theme);
				this.drawPie(this.formatSeries(this.chartData));
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
		// this.getData();

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
		url = this.replace(url, '{{step}}', `=${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				this.chartData = res.data;
				this.pending = false;
				this.drawPie(this.formatSeries(res.data));
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
		results.forEach((result) => {
			let name: string;
			let metric = result.metric;
			for (let key in metric) {
				legend = key;
				name = metric[key];
			}
			dateList.push(name);
			dataArray.push({
				name: name,
				value: result.value[1]
			});
		});
		return { dateList: dateList, data: dataArray, legend: legend };
	}

	drawPie(data) {
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
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c} ({d}%)'
			},
			legend: {
				orient: 'vertical',
				left: '5%',
				data: data.dateList,
				textStyle: {
					color: echarts.textColor
				}
			},

			series: [
				{
					name: data.legend,
					type: 'pie',
					radius: '80%',
					center: [ '50%', '50%' ],
					data: data.data,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: echarts.itemHoverShadowColor
						}
					},
					label: {
						normal: {
							textStyle: {
								color: echarts.textColor
							}
						}
					},
					labelLine: {
						normal: {
							lineStyle: {
								color: echarts.axisLineColor
							}
						}
					}
				}
			]
		};
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
