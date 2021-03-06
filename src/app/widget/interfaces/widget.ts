import { graphic, ECharts, EChartOption, EChartsOptionConfig } from 'echarts';
import { GridsterItem } from 'angular-gridster2';
export interface Widget extends GridsterItem {
	id?: string;
	title?: string;
	query?: Array<Query>;
	type?: ChartType;
}

export interface ChartType {
	apiVersion?: string;
	kind?: string;
	metadata?: {
		creationTimestamp?: string;
		generation?: number;
		name?: string;
		resourceVersion?: string;
		selfLink?: string;
		uid?: string;
	};
	spec?: {
		chartInfo?: string;
		category?: any;
		title?: any;
		max_queries?: any;
		detail_view_datapoint_count?: any;
		panel_datapoint_count?: any;
	};
}
export interface Query {
	apiVersion?: string;
	kind?: string;
	metadata?: {
		creationTimestamp?: string;
		generation?: number;
		name?: string;
		resourceVersion?: string;
		selfLink?: string;
		uid?: string;
	};
	spec?: {
		query_info: {
			chart_url?: string;
			total_url?: string;
			all_data_url?: string;
			filtered_data_url?: string;
			prev_data_url?: string;
			prev_url?: string;
			base_url?: string;
			param?: string;
			port?: number;
			query_category?: string;
			x_axis_label?: string;
			title?: string;
			units?: string;
			total_label?: string;
		};
		category?: string;
	};
}
