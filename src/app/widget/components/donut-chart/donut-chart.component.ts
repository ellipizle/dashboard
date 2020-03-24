import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy,
	EventEmitter,
	Output,
	SimpleChanges
} from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { data } from 'pie';
import { Subject } from 'rxjs';
@Component({
	selector: 'app-donut-chart',
	templateUrl: './donut-chart.component.html',
	styleUrls: [ './donut-chart.component.scss' ]
})
export class DonutChartComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getData();
		}
	}
	@Input() public item: Widget;
	@Input() public index: any;
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
	fielName;
	unitType;
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
	onChartEvent(event: any, type: string) {
		let data = {};
		data['name'] = this.fielName;
		data['filters'] = event['selected'];
		this.filter.emit(data);
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	ngOnChanges(simple: SimpleChanges) {
		// console.log(simple["item"] && simple["item"].currentValue);
		// if (simple['item'] && simple['item'].currentValue) {
		// 	this.getData();
		// }
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res && this.item) {
				this.duration = res.short;
				this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		if (this.item && this.item.query.length > 0) {
			let url = this.item.query[0].spec.query_info.base_url;
			this.unitType = this.item.query[0].spec.query_info.units;
			url = this.replace(url, '+', '%2B');
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{DURATION}}', `${this.duration}`);
			url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
			url = this.replace(url, '{{startTime}}', `${this.endTime}`);
			url = this.replace(url, '{{endTime}}', `${this.step}`);
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
				this.fielName = key;
				legend = key ? key : 'unknown';
				name = metric[key];
			}
			dateList.push(name);
			dataArray.push({
				name: name,
				value: this.unitType == 'bytes' ? Math.round(result.value[1] / 1048576) : Math.round(result.value[1])
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
				formatter: this.unitType == 'bytes' ? `{a} <br/>{b} : {c}MB ({d}%)` : '{a} <br/>{b} : {c} ({d}%)'
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
					radius: [ '50%', '70%' ],
					// center: [ '50%', '70%' ],
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
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
