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
import { GuargeWidget } from '../../interfaces/widget';
@Component({
	selector: 'app-guarge',
	templateUrl: './guarge.component.html',
	styleUrls: [ './guarge.component.scss' ]
})
export class GuargeComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() public item: GuargeWidget;
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
			tooltip: {
				formatter: '{a} <br/>{b} : {c}%'
			},
			toolbox: {
				feature: {
					restore: {},
					saveAsImage: {}
				}
			},
			series: [
				{
					name: 'disk',
					type: 'gauge',
					detail: { formatter: '{value}%' },
					data: [ { value: 50, name: 'disk space' } ]
				}
			]
		};
	}
}
