import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { GridsterItem } from 'angular-gridster2';
export interface BaseWidget extends GridsterItem {
	id: string;
	title: string;
	aggregrateQuery?: string;
	query?: Array<string>;
}

export interface BarWidget extends BaseWidget {
	type?: string;
	chartOption?: EChartOption;
}

export interface GuargeWidget extends BaseWidget {
	type?: string;
	chartOption?: EChartOption;
}

export interface LineWidget extends BaseWidget {
	type?: string;
	chartOption?: EChartOption;
}
