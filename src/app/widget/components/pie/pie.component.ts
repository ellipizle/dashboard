import { Component, OnInit, AfterViewInit, ChangeDetectorRef, Input, ElementRef, OnDestroy } from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
@Component({
	selector: 'app-pie',
	templateUrl: './pie.component.html',
	styleUrls: [ './pie.component.scss' ]
})
export class PieComponent implements AfterViewInit, OnDestroy {
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
			const colors: any = config.theme.variables;
			const echarts: any = config.echart;

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
					left: 'left',
					data: [ 'USA', 'Germany', 'France', 'Canada', 'Russia' ],
					textStyle: {
						color: echarts.textColor
					}
				},
				series: [
					{
						name: 'Countries',
						type: 'pie',
						radius: '80%',
						center: [ '50%', '50%' ],
						data: [
							{ value: 335, name: 'Germany' },
							{ value: 310, name: 'France' },
							{ value: 234, name: 'Canada' },
							{ value: 135, name: 'Russia' },
							{ value: 1548, name: 'USA' }
						],
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
		});
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
	}
}
