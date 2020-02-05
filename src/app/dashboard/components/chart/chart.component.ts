import {
	Component,
	ChangeDetectorRef,
	Input,
	OnInit,
	HostListener,
	AfterViewInit,
	ViewEncapsulation,
	OnChanges,
	SimpleChanges,
	ChangeDetectionStrategy
} from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: [ './chart.component.scss' ]
	// changeDetection: ChangeDetectionStrategy.
	// encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() public item: any;
	@Input() public data: any;
	@Input() public unitHeight: number;

	height = 500;
	width;
	options: any;
	echartsInstance: ECharts;
	public loaded: boolean;
	constructor(private cd: ChangeDetectorRef) {}

	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	public ngOnChanges(changes: SimpleChanges): void {
		if (this.unitHeight) {
			this.onResize('');
		}
	}

	ngOnInit() {}
	ngAfterViewInit() {
		setTimeout(() => {
			this.drawChart();
		});
	}

	public onResize(event) {
		console.log(event);
		if (this.echartsInstance) this.echartsInstance.resize();
		// this.echartsInstance.setOption({
		// 	visualMap: [ 'blue', 'red' ]
		// });
		this.height = this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10;
		this.width = this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10;
		console.log(
			this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10,
			this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10
		);
		this.cd.detectChanges();
	}

	drawChart() {
		// console.log(
		// 	this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10,
		// 	this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10
		// );
		const optionsHeight: number = this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10;
		const optionsWidth: number = this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10;
		// this.options = {
		// 	xAxis: {
		// 		type: 'category',
		// 		data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
		// 	},
		// 	yAxis: {
		// 		type: 'value'
		// 	},
		// 	series: [
		// 		{
		// 			data: [ 120, 200, 150, 80, 70, 110, 130 ],
		// 			type: 'bar',
		// 			color: '#eab839'
		// 		}
		// 	]
		// };
		this.options = {
			textStyle: {
				color: '#d8d9da'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: [ '直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎' ]
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			yAxis: {
				type: 'value'
				// nameTextStyle: {
				// 	color: 'red'
				// }
			},
			xAxis: {
				type: 'category',
				data: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ]
				// nameTextStyle: {
				// 	color: 'red',
				// 	font: 89
				// }
			},
			series: [
				{
					name: 'blue',
					type: 'bar',
					stack: '总量',
					label: {
						show: false,
						position: 'insideRight'
					},
					data: [ 320, 302, 301, 334, 390, 330, 320 ]
				},
				{
					name: 'red',
					type: 'bar',
					stack: '总量',
					label: {
						show: false,
						position: 'insideRight'
					},
					data: [ 120, 132, 101, 134, 90, 230, 210 ]
				},
				{
					name: 'green',
					type: 'bar',
					stack: '总量',
					label: {
						show: false,
						position: 'insideRight'
					},
					data: [ 220, 182, 191, 234, 290, 330, 310 ]
				},
				{
					name: 'ice',
					type: 'bar',
					stack: '总量',
					label: {
						show: false,
						position: 'insideRight'
					},
					data: [ 150, 212, 201, 154, 190, 330, 410 ]
				},
				{
					name: 'bit',
					type: 'bar',
					stack: '总量',
					label: {
						show: false,
						position: 'insideRight'
					},
					data: [ 820, 832, 901, 934, 1290, 1330, 1320 ]
				}
			]
		};
	}
}
