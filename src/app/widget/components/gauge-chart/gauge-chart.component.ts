import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { ConfigService } from '../../../core/services/config.service';
import { DatasourceService } from '../../services/datasource.service';
import { Widget } from '../../interfaces/widget';
import { PanelService } from '../../../shared/services/panel.service';
import { TimerService } from '../../../shared/services/timer.service';
import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { Subject } from 'rxjs';
declare var ResponsiveGauge: any;
@Component({
	selector: 'app-gauge-chart',
	templateUrl: './gauge-chart.component.html',
	styleUrls: [ './gauge-chart.component.scss' ],
	encapsulation: ViewEncapsulation.None
})
export class GaugeChartComponent implements AfterViewInit, OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();
	@Input('reset')
	set reset(data: boolean) {
		if (data) {
			this.getData();
		}
	}
	@Input() public item: Widget;
	@Input() public index: any;
	@Input() public unitHeight: any;
	@Input() public parentRef: ElementRef;
	@HostListener('window:resize', [ '$event' ])
	onResized(event) {
		// this.echartsInstance.resize();
		this.cd.detectChanges();
	}
	startTime: any = 1581722395;
	endTime: any = 1581723395;
	duration: any = 1581722395;
	step: any = 15;
	url: any;

	echartsInstance: ECharts;

	themeSubscription: any;
	colors: any;
	echarts: any;
	interval;
	pending: boolean;
	chartData;
	public canvasWidth = 500;
	public needleValue = 65;
	public centralLabel = '';
	public name = 'Gauge chart';
	public bottomLabel = '65';
	needleLable;
	unitType;
	percentageValue: (value: number) => string;
	constructor(
		private configSvc: ConfigService,
		private cd: ChangeDetectorRef,
		private dataSource: DatasourceService,
		private panelService: PanelService,
		private timerService: TimerService,
		private elementRef: ElementRef
	) {
		this.percentageValue = (value: number) => {
			return `${Math.round(value)} ${this.unitType} `;
		};
		//get chart styles
		this.themeSubscription = this.configSvc.getSelectedThemeObs().subscribe((config: any) => {
			this.colors = config.theme.variables;
			this.echarts = config.echart;

			if (this.chartData) {
				this.drawPie(this.chartData);
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
	public ngOnChanges(changes: SimpleChanges): void {
		if (this.unitHeight) {
			this.canvasWidth = this.parentRef['width'];
			// console.log(this.elementRef.nativeElement.offsetHeight);
			// this.onResize('');
		}
	}
	onChartInit(e: ECharts) {
		this.echartsInstance = e;
	}
	replace(value, matchingString, replacerString) {
		return value.replace(matchingString, replacerString);
	}
	ngAfterViewInit() {
		this.timerService.getDateRangeObs().subscribe((res: any) => {
			if (res) {
				this.duration = res.short;
				this.step = Math.round((res.end - res.start) / this.item.type.spec.panel_datapoint_count);
				this.getData();
			}
		});
		this.cd.detectChanges();
	}

	getData() {
		console.log(this.item);
		let url = this.item.query[0].spec.base_url;
		this.unitType = this.item.query[0].spec.units;
		url = this.replace(url, '+', '%2B');
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{DURATION}}', `${this.duration}`);
		url = this.replace(url, '{{STARTTIME}}', `${this.startTime}`);
		url = this.replace(url, '{{ENDTIME}}', `${this.endTime}`);
		url = this.replace(url, '{{STEP}}', `${this.step}`);
		this.pending = true;
		this.panelService.getPanelData(url).subscribe(
			(res: any) => {
				this.chartData = res.data;
				this.pending = false;
				// console.log('In Guarge');
				// console.log(this.item);
				// console.log(res.data);
				this.drawPie(res.data);
			},
			(error) => {
				this.pending = false;
			}
		);
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
				legend = key;
				name = metric[key];
			}
			dateList.push(name);
			dataArray.push({
				name: name,
				value: result.value[1]
			});
		});
		return { dateList: dateList, data: dataArray, legend: legend };
	}

	drawPie(data) {
		const colors: any = this.colors;
		const echarts: any = this.echarts;
		// this.options.arcDelimiters = [ Math.round(data.result[0].value[1]) ];
		this.needleValue = Math.round(data.result[0].value[1]);
		this.needleLable = `${Math.round(data.result[0].value[1])} %`;
		this.bottomLabel = `${data.result[0].metric[Object.keys(data.result[0].metric)[0]]} ${Math.round(
			data.result[0].value[1]
		)}`;
		this.name = this.item.query[0].metadata.name;
	}

	ngOnDestroy(): void {
		this.themeSubscription.unsubscribe();
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
