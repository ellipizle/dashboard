import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { GridsterItem } from 'angular-gridster2';
export interface Widget extends GridsterItem {
	id: string;
	title: string;
	query?: string;
	type?: string;
}
