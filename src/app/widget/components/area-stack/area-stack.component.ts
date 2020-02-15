import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { PanelService } from '../../../shared/services/panel.service';
import { Widget } from '../../interfaces/widget';
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
	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService,
		private panelService: PanelService
	) {}
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}

	getData() {
		let url = this.item.query.spec.base_url;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{startTime}}', `${this.startTime}`);
		url = this.replace(url, '{{endTime}}', `${this.endTime}`);
		url = this.replace(url, '{{step}}', `=${this.step}`);
		this.panelService.getPanelData(url).subscribe((res) => {
			console.log(res);
		});
	}

	ngAfterViewInit() {
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			const colors: any = config.theme.variables;
			const echarts: any = config.echart;
			this.getData();
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
				legend: {
					data: [
						'Mail marketing',
						'Affiliate advertising',
						'Video ad',
						'Direct interview',
						'Search engine'
					],
					textStyle: {
						color: echarts.textColor
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						data: [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ],
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
				series: [
					{
						name: 'Mail marketing',
						type: 'line',
						stack: 'Total amount',
						areaStyle: { normal: { opacity: echarts.areaOpacity } },
						data: [ 120, 132, 101, 134, 90, 230, 210 ]
					},
					{
						name: 'Affiliate advertising',
						type: 'line',
						stack: 'Total amount',
						areaStyle: { normal: { opacity: echarts.areaOpacity } },
						data: [ 220, 182, 191, 234, 290, 330, 310 ]
					},
					{
						name: 'Video ad',
						type: 'line',
						stack: 'Total amount',
						areaStyle: { normal: { opacity: echarts.areaOpacity } },
						data: [ 150, 232, 201, 154, 190, 330, 410 ]
					},
					{
						name: 'Direct interview',
						type: 'line',
						stack: 'Total amount',
						areaStyle: { normal: { opacity: echarts.areaOpacity } },
						data: [ 320, 332, 301, 334, 390, 330, 320 ]
					},
					{
						name: 'Search engine',
						type: 'line',
						stack: 'Total amount',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: echarts.textColor
								}
							}
						},
						areaStyle: { normal: { opacity: echarts.areaOpacity } },
						data: [ 820, 932, 901, 934, 1290, 1330, 1320 ]
					}
				]
			};
		});
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
