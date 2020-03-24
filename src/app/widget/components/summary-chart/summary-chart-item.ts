import {
	Component,
	EventEmitter,
	Output,
	OnInit,
	AfterViewInit,
	HostListener,
	ChangeDetectorRef,
	Input,
	OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { Widget, Query } from '../../interfaces/widget';
import { forkJoin } from 'rxjs';
import { Subject } from 'rxjs';
import * as _moment from 'moment';
const moment = _moment;
@Component({
	selector: 'app-summary-chart-item',
	template: `
	<div class="whole"   [style.background-color]="echarts.bg" >
	<div class="summary" [ngClass]="{'deactivated': !isActive}" (click)="onTableClick(data.name)">
			<div class="summary-container">
		  			<div class="title">{{data?.name}}</div>
			 		 <div class="section" >{{data?.result[0]?.value[1] | round}}</div>
			<div>
					<div class="item" *ngIf="change > 0" fxLayout="row">
							<span class="material-icons green-color" fxFlex="7%">
								trending_up
								</span>
								<span fxFlex="grow">Increased by {{changeRate}} from {{duration}} ago</span>
					</div>
					<div class="item" *ngIf="change < 0" fxLayout="row">
							<span class="material-icons red-color" fxFlex="7%">
								trending_down
								</span>
								<span fxFlex="grow">Decreased by {{changeRate}} from {{duration}} ago</span>
					</div>
					<div class="item" *ngIf="change == 0" fxLayout="row">
							<span class="material-icons " fxFlex="7%">
								remove
								</span>
								<span fxFlex="grow">Increased by {{changeRate}} from {{duration}} ago</span>
					</div>
					</div>
			</div>
			</div>
			</div>
	<div echarts [options]="options"  (chartClick)="onChartClick($event, 'chartClick')" class="echart"  (chartInit)="onChartInit($event)"></div>

	`,
	styles: [
		`
		.title{
			font-size:2.5rem
		}
		.whole {
	cursor: pointer;
			}

		.green-color{
			color:green
		}
				.red-color{
			color:red
		}
		.item-text{
			display:inline-block;

		}
		.item-icon{
			display:inline-block;
		}
		.echart {
			height: calc(100% - 295px);
			width: 100%;
		}


			.summary-container {
			width: 98%;
    margin: 0 auto;
    padding-top: 15px;

				}

		.section{
display: inline-block;
    font-size: 9rem;
    padding: 45px;
    margin-top: 25px;
}
.item{
		padding: 15px;
			font-size:1.5rem
}

			.deactivated{
				background:#c5cae9;
							h2,
			h3 {
				color:#9fa9be
			}

			}
	`
	]
})
export class SummaryChartItemComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	isActive: boolean = true;
	unitType;
	fieldName;
	@Input() public item: Widget;
	@Input() public index: any;
	@Input() public query: Query;
	@Output() total = new EventEmitter();
	@Output() filter: EventEmitter<any> = new EventEmitter();
	changeRate: any;
	change: any;
	pending: boolean;

	detailView: boolean;

	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		this.cd.detectChanges();
	}
	value = 80;
	// bufferValue = 100;
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	duration: any = 1581722395;
	step: any = 15;
	url: any;

	echartsInstance: ECharts;
	data: any;
	themeSubscription: any;
	options: any = {};
	colors: any;
	echarts: any;
	interval;
	chartData;
	seriesData = [];
	legendData = [];
	xAxisData = [];
	realValue;
	percentageData;
	constructor(
		private route: Router,
		private location: Location,
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService,
		private panelService: PanelService,
		private timerService: TimerService
	) {
		this.route.events.subscribe((res) => {
			let url = this.location.path().split('/');
			if (url[2] && url[2] == 'panel') {
				console.log('is detail panel');
				this.detailView = true;
			} else {
				this.detailView = false;
			}
		});
		//get chart styles
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			this.colors = config.theme.variables;
			this.echarts = config.echart;
			if (this.seriesData) {
				// this.drawChart(this.formatSeries(this.seriesData));
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
	onTableClick($event) {
		this.isActive = !this.isActive;
		let data = {};
		data['name'] = 'all';
		data['filter'] = !this.isActive;
		this.filter.emit(data);
	}
	onChartClick(event: any, type: string) {
		let data = {};
		data['name'] = 'filter';
		data['filters'] = event['value'][0];
		this.filter.emit(data);
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
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
		this.seriesData = [];
		let url = this.query.spec.query_info.base_url;
		console.log(this.query);
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		let prev_url = this.query.spec.query_info.prev_url;
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{STARTTIME}}', `${this.startTime}`);
		prev_url = this.replace(prev_url, '{{ENDTIME}}', `${this.endTime}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);

		let total_url = this.query.spec.query_info.total_url;
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '+', '%20');
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{DURATION}}', `${this.duration}`);
		prev_url = this.replace(prev_url, '{{STARTTIME}}', `${this.startTime}`);
		prev_url = this.replace(prev_url, '{{ENDTIME}}', `${this.endTime}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		prev_url = this.replace(prev_url, '{{STEP}}', `${this.step}`);
		let chart_url = this.query.spec.query_info.chart_url;
		chart_url = this.replace(chart_url, '+', '%20');
		chart_url = this.replace(chart_url, '+', '%20');
		chart_url = this.replace(chart_url, '{{DURATION}}', `${this.duration}`);
		chart_url = this.replace(chart_url, '{{DURATION}}', `${this.duration}`);
		chart_url = this.replace(chart_url, '{{STARTTIME}}', `${this.startTime}`);
		chart_url = this.replace(chart_url, '{{ENDTIME}}', `${this.endTime}`);
		chart_url = this.replace(chart_url, '{{STEP}}', `${this.step}`);
		chart_url = this.replace(chart_url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		forkJoin(
			this.panelService.getPanelData(url),
			this.panelService.getPanelData(prev_url),
			this.panelService.getPanelData(total_url),
			this.panelService.getPanelData(chart_url)
		).subscribe(
			(res: any) => {
				res[0].data['name'] = this.query.spec.query_info.title;
				this.data = res[0].data;
				if (this.index == 0) {
					let percentage = {};
					percentage['value'] = res[2].data.result[0].value[1];
					percentage['label'] = this.query.spec.query_info.total_label;
					this.total.emit(percentage);
				}

				let currentData = res[0].data;
				let previousData = res[1].data;
				let totalData = res[2].data;
				this.realValue =
					parseInt(currentData.result[0].value[1]) / parseInt(totalData.result[0].value[1]) * 100;
				let change = Math.round(currentData.result[0].value[1]) - Math.round(previousData.result[0].value[1]);
				this.change = change;
				// this.changeRate =
				// 	change < 0
				// 		? ` Decreased by ${Math.abs(change)} from ${this.duration} ago`
				// 		: ` ${"<span class='material-icons'>call_missed_outgoing</span>"}  Increased by ${change} from ${this
				// 				.duration} ago`;
				if (change < 0) {
					this.changeRate = Math.abs(change);
				} else {
					this.changeRate = change;
				}
				// this.drawBar(this.formatSeries(res[3].data));
				this.dBar(res[3].data);
				let url = this.location.path().split('/');
				if (url[2] && url[2] == 'panel') {
					this.onTableClick(this.data.name);
				}
			},
			(error) => {
				this.pending = false;
			}
		);
	}

	formatSeries(data) {
		console.log(data);
		let legend: string;
		let results = data.result[0].values;
		let xAxisList: Array<any> = [];
		let dataArray: Array<any> = [];
		results.forEach((result) => {
			xAxisList.push(name);
			dataArray.push({
				name: result[0],
				type: 'bar',
				label: {
					color: this.echarts.textColor,
					show: false,
					position: 'bottom',
					formatter: '{a}'
				},
				// barWidth: '60%',
				data: [ this.unitType == 'bytes' ? Math.round(result[1] / 1048576) : Math.round(result[1]) ]
			});
		});
		return { xAxis: xAxisList, series: dataArray, legend: legend };
	}
	dBar(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		var self = this;
		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.infoLight ],
			legend: {},
			grid: {
				show: false,
				top: '2%',
				left: '1%',
				right: '1%',
				bottom: '5%'
			},
			tooltip: {
				trigger: 'axis',
				formatter: function(params) {
					return `	${moment.unix(params[0].axisValueLabel).format('M/D/Y, h:mm a')} : ${params[0].value[1]} `;
				}
			},
			dataset: {
				source: data.result[0].values
			},
			xAxis: {
				type: 'category',
				axisLabel: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			},
			yAxis: {
				axisLabel: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},

				splitLine: {
					show: false,
					lineStyle: {
						color: echarts.splitLineColor
					}
				}
			},
			series: [ { type: 'bar' } ]
		};
	}
	drawBar(data) {
		console.log(data);
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		var self = this;
		this.options = {
			backgroundColor: echarts.bg,
			color: [ colors.infoLight ],
			tooltip: {
				trigger: 'cross',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				show: false,
				top: '2%',
				left: '1%',
				right: '1%',
				bottom: '5%'
				// containLabel: false
			},
			xAxis: {
				type: 'category',
				axisLabel: {
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			},
			yAxis: [
				{
					nameTextStyle: {
						align: 'right'
					},
					type: 'value',
					// interval: 20,
					axisLine: {
						show: false,
						lineStyle: {
							color: echarts.axisLineColor
						}
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: echarts.splitLineColor
						}
					},
					axisTick: {
						show: false
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
						show: false,
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
