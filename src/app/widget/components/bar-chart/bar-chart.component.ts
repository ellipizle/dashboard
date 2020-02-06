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
import { DatasourceService } from '../../services/datasource.service';
import { BarWidget } from '../../interfaces/widget';
@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: [ './bar-chart.component.scss' ]
})
export class BarChartComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() public item: BarWidget;
	@Input() public data: any;
	@Input() public unitHeight: number;

	height = 500;
	width;
	options: any;
	echartsInstance: ECharts;
	public loaded: boolean;
	constructor(private cd: ChangeDetectorRef, private dataSource: DatasourceService) {}

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
			//TODO: call datasource method (datasource will draw chart)
			this.drawChart();
		});
	}

	getDataFromSource() {
		this.dataSource.getMetric(this.item.aggregrateQuery).subscribe((res) => {
			// call drawChart() passing the return data
		});
	}
	public onResize(event) {
		if (this.echartsInstance) this.echartsInstance.resize();
		this.height = this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10 - 35;
		this.width = this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10;
		this.cd.detectChanges();
	}

	drawChart() {
		const optionsHeight: number = this.item.rows * (this.unitHeight - 10) + (this.item.rows - 4) * 10 - 35;
		const optionsWidth: number = this.item.cols * (this.unitHeight - 10) + (this.item.cols - 4) * 10;
		this.options = {
			grid: {
				right: '35',
				bottom: '25',
				top: '15',
				left: '45'
			},
			textStyle: {
				color: '#fff'
			},
			xAxis: {
				type: 'category',
				data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ]
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: [ 120, 200, 150, 80, 70, 110, 130 ],
					type: 'bar',
					color: '#eab839'
				}
			]
		};
	}
}
