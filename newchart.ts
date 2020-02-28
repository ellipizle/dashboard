const chadrt = {
	apiVersion: 'ws.io/v1',
	items: [
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'area-graph',
				resourceVersion: '188067',
				selfLink: '/apis/ws.io/v1/dashboardcharts/area-graph',
				uid: 'afef2300-e8d1-4810-a354-18ae1cbd17d7'
			},
			spec: {
				category: 'time-series',
				chartInfo: {},
				detail_view_datapoint_count: 200,
				max_queries: 4,
				panel_datapoint_count: 50,
				title: 'Area Graph'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:16Z',
				generation: 1,
				name: 'bar-animation',
				resourceVersion: '188054',
				selfLink: '/apis/ws.io/v1/dashboardcharts/bar-animation',
				uid: 'ab3577e5-2976-4369-8605-7d2a99941db5'
			},
			spec: {
				category: 'time-series',
				chartInfo: {},
				detail_view_datapoint_count: 200,
				max_queries: 2,
				panel_datapoint_count: 50,
				title: 'Bar Animation'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'bar-chart',
				resourceVersion: '188063',
				selfLink: '/apis/ws.io/v1/dashboardcharts/bar-chart',
				uid: 'c609740f-fd30-489a-8a24-ec4a6732b855'
			},
			spec: { category: 'discrete-data', chartInfo: {}, title: 'Bar Chart' }
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'gauge',
				resourceVersion: '188065',
				selfLink: '/apis/ws.io/v1/dashboardcharts/gauge',
				uid: 'b29eef17-cef3-4578-84e3-78feaf89d4fa'
			},
			spec: { category: 'summary', chartInfo: {}, max_queries: 2, title: 'Gauge' }
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:16Z',
				generation: 1,
				name: 'line-graph',
				resourceVersion: '188056',
				selfLink: '/apis/ws.io/v1/dashboardcharts/line-graph',
				uid: '3bfdf02a-3b3d-414c-abaa-e6945635ff52'
			},
			spec: {
				category: 'time-series',
				chartInfo: {},
				detail_view_datapoint_count: 200,
				max_queries: 4,
				panel_datapoint_count: 50,
				title: 'Line Graph'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'pie-chart',
				resourceVersion: '188061',
				selfLink: '/apis/ws.io/v1/dashboardcharts/pie-chart',
				uid: 'f265e5ca-1bd1-4936-98ad-a5f897f4d257'
			},
			spec: { category: 'discrete-data', chartInfo: {}, title: 'Pie-Chart' }
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:16Z',
				generation: 1,
				name: 'pie-donut-chart',
				resourceVersion: '188059',
				selfLink: '/apis/ws.io/v1/dashboardcharts/pie-donut-chart',
				uid: '3b3bcaa6-36e9-4f10-bd20-d7dd91b16f82'
			},
			spec: { category: 'discrete-data', chartInfo: {}, title: 'Pie-Donut-Chart' }
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardChart',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'summary-bar',
				resourceVersion: '188069',
				selfLink: '/apis/ws.io/v1/dashboardcharts/summary-bar',
				uid: '77e20fae-6f69-4a60-881c-4b003f8809e3'
			},
			spec: { category: 'summary', chartInfo: {}, max_queries: 4, title: 'Summary' }
		}
	],
	kind: 'DashboardChartList',
	metadata: { continue: '', resourceVersion: '210791', selfLink: '/apis/ws.io/v1/dashboardcharts' }
};
