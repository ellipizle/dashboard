import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from '../services/dashboard.service';
import { ChartType, Query } from '../../widget/interfaces/widget';
import { ConfigService } from '../../core/services/config.service';
@Component({
	selector: 'app-json-dialog',
	templateUrl: './json-dialog.component.html',
	styleUrls: [ './json-dialog.component.scss' ]
})
export class JsonDialogComponent implements OnInit {
	formSubmitted: boolean;
	data: any;
	themeSubscription: any;
	colors: any;
	echarts: any;
	constructor(
		public dialogRef: MatDialogRef<JsonDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public widgetData,
		private dashboardSvc: DashboardService,
		private configSvc: ConfigService
	) {
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			this.colors = config.theme.variables;
			this.echarts = config.echart;
		});
	}

	ngOnInit() {
		if (this.widgetData) {
			switch (this.widgetData.type.metadata.name) {
				case 'bar-chart':
					this.data = this.getBarChart();
				case 'area-graph':
					this.data = this.getAreaStack();
				case 'pie-chart':
					this.data = this.getPieChart();
				case 'line-graph':
					this.data = this.getLineChart();
			}
		}
	}

	submitForm() {
		this.formSubmitted = false;
		this.dialogRef.close();
	}

	getAreaStack() {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		return {
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
					data: [],
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
					},
					axisPointer: {
						label: {}
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
			series: []
		};
	}

	getBarChart() {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		return {
			backgroundColor: echarts.bg,
			color: [ colors.primaryLight ],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			grid: {
				top: '3%',
				left: '3%',
				right: '4%',
				bottom: '5%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: [],
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
					type: 'bar',
					barWidth: '60%',
					data: []
				}
			]
		};
	}

	getLineChart() {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		return {
			backgroundColor: echarts.bg,
			color: [ colors.danger, colors.primary, colors.info ],
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b} : {c}'
			},
			toolbox: {
				show: true,
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					dataView: {
						readOnly: false,
						lang: [ 'data view', 'turn off', 'refresh' ]
					},
					saveAsImage: {}
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
					data: [],
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
					type: 'log',
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
			series: []
		};
	}

	getPieChart() {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		return {
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
				data: [],
				textStyle: {
					color: echarts.textColor
				}
			},
			series: [
				{
					type: 'pie',
					radius: '80%',
					center: [ '50%', '50%' ],
					data: [],
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
}
