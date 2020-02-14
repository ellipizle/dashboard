import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { Widget } from '../../interfaces/widget';
@Component({
	selector: 'app-bar-animation',
	templateUrl: './bar-animation.component.html',
	styleUrls: [ './bar-animation.component.scss' ]
})
export class BarAnimationComponent implements AfterViewInit, OnDestroy {
	@Input() public item: Widget;
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
			const xAxisData = [];
			const data1 = [];
			const data2 = [];

			const colors: any = config.theme.variables;
			const echarts: any = config.echart;

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
		});
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
