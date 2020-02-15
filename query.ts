const q = {
	apiVersion: 'ws.io/v1',
	items: [
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-07T22:33:33Z',
				generation: 1,
				name: 'throughput-all',
				resourceVersion: '34677',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-all',
				uid: '88a0c101-2e3b-45cf-a68a-59508a318cf7'
			},
			spec: {
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes[5m])*60+rate(endpoint_tx_bytes[5m])*60a\u0026start={{startTime}}\u0026end={{endTime}}\u0026step{{step}})',
				params: '',
				port: 9090,
				query_category: 'time-series',
				x_axis_label: 'Throughput'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-07T22:33:44Z',
				generation: 1,
				name: 'throughput-wired',
				resourceVersion: '34679',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-wired',
				uid: 'ca7f6f9c-9197-45a2-9828-a0cb876aa548'
			},
			spec: {
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes{connectivityType!="wireless"}[5m])*60+rate(endpoint_tx_bytes{connectivityType!="wireless"}[5m])*60)\u0026start={{startTime}}\u0026end={{endTime}}\u0026step{{step}})',
				params: '',
				port: 9090,
				query_category: 'time-series',
				x_axis_label: 'Throughput'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-07T22:33:54Z',
				generation: 1,
				name: 'throughput-wireless',
				resourceVersion: '34681',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-wireless',
				uid: '36177328-154b-494d-beaa-76e7e7bf5c6d'
			},
			spec: {
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes{connectivityType="wireless"}[5m])*60+rate(endpoint_tx_bytes{connectivityType="wireless"}[5m])*60)\u0026start={{startTime}}\u0026end={{endTime}}\u0026step{{step}}',
				params: '',
				port: 9090,
				query_category: 'time-series',
				x_axis_label: 'Throughput'
			}
		}
	],
	kind: 'DashboardQueryList',
	metadata: { continue: '', resourceVersion: '97004', selfLink: '/apis/ws.io/v1/dashboardqueries' }
};
