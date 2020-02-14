import { Component, AfterViewInit, ChangeDetectorRef, Input, OnDestroy, ElementRef } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
@Component({
	selector: 'app-bar',
	templateUrl: './bar.component.html',
	styleUrls: [ './bar.component.scss' ]
})
export class BarComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
	@Input() public parentRef: ElementRef;
	@Input() public index: any;
	@Input() public data: any;
	@Input() public unitHeight: number;

	height: any;
	width: any;
	echartsInstance: ECharts;

	themeSubscription: any;
	options: any = {};
	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService
	) {}
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	public onResize(event) {
		if (this.echartsInstance) this.echartsInstance.resize();
		this.height = this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10 - 35;
		this.width = this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10;
		this.cd.detectChanges();
	}

	ngAfterViewInit() {
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			const colors: any = config.theme.variables;
			const echarts: any = config.echart;

			this.options = {
				backgroundColor: echarts.bg,
				color: [ colors.primaryLight ],
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '5%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
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
						name: 'Score',
						type: 'bar',
						barWidth: '60%',
						data: [ 10, 52, 200, 334, 390, 330, 220 ]
					}
				]
			};
		});
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
