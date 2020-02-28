const queries = {
	apiVersion: 'ws.io/v1',
	items: [
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'avg-wired-conn-time',
				resourceVersion: '188091',
				selfLink: '/apis/ws.io/v1/dashboardqueries/avg-wired-conn-time',
				uid: '172b6493-8f54-4266-8a91-adc84ce634b4'
			},
			spec: {
				base_url:
					'api/v1/query?query=avg_over_time(endpoint_conn_time{connectivityType!="wireless"}[{{DURATION}}])',
				port: 9090,
				query_category: 'summary',
				title: 'Average Wired Connection Time'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'avg-wireless-conn-time',
				resourceVersion: '188083',
				selfLink: '/apis/ws.io/v1/dashboardqueries/avg-wireless-conn-time',
				uid: 'ccfc3928-53f8-44b5-9c22-cb2d3d022bb0'
			},
			spec: {
				base_url:
					'api/v1/query?query=avg_over_time(endpoint_conn_time{connectivityType="wireless"}[{{DURATION}}])',
				port: 9090,
				query_category: 'summary',
				title: 'Average Wireless Connection Time'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'byod-endpoint-count',
				resourceVersion: '188093',
				selfLink: '/apis/ws.io/v1/dashboardqueries/byod-endpoint-count',
				uid: '347301c3-1404-4309-87ab-913b03b118e2'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{deviceAuthType!="BYOD"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{deviceAuthType!="BYOD"})',
				port: 9090,
				query_category: 'summary',
				title: 'BYOD Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'endpoint-count',
				resourceVersion: '188071',
				selfLink: '/apis/ws.io/v1/dashboardqueries/endpoint-count',
				uid: '537f427b-d9ae-4a5e-aef8-3654abe0ce57'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state)\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state)',
				port: 9090,
				query_category: 'summary',
				title: 'Total Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'guest-endpoint-count',
				resourceVersion: '188101',
				selfLink: '/apis/ws.io/v1/dashboardqueries/guest-endpoint-count',
				uid: 'd132ef17-fa08-4206-991d-0339ac2521b7'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{networkType!="guest"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{networkType!="guest"})',
				port: 9090,
				query_category: 'summary',
				title: 'Guest Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'iot-endpoint-count',
				resourceVersion: '188103',
				selfLink: '/apis/ws.io/v1/dashboardqueries/iot-endpoint-count',
				uid: '93f6b346-1f81-4a44-98ee-7c5b5d65ef9e'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{deviceCategory!="IOT"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{deviceCategory!="IOT"})',
				port: 9090,
				query_category: 'summary',
				title: 'IOT Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'registered-endpoint-count',
				resourceVersion: '188095',
				selfLink: '/apis/ws.io/v1/dashboardqueries/registered-endpoint-count',
				uid: 'c0e7c3f5-ff51-4f64-ab09-ce40af01e83a'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{deviceRegistered!="true"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{deviceRegistered!="true"})',
				port: 9090,
				query_category: 'summary',
				title: 'Registered Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'throughput-all',
				resourceVersion: '188079',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-all',
				uid: 'f6618eb2-1d53-4897-a65b-915a3b688ca6'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes[5m])*60%2Brate(endpoint_tx_bytes[5m])*60)\u0026start={{startTime}}\u0026end={{endTime}}\u0026step={{step}}',
				filtered_data_url: '',
				params: '',
				port: 9090,
				query_category: 'time-series',
				title: 'Throughput'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'throughput-wired',
				resourceVersion: '188087',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-wired',
				uid: '764e8ec6-182a-4a83-93a2-34d8f84b2bb2'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes{connectivityType!="wireless"}[5m])*60%2Brate(endpoint_tx_bytes{connectivityType!="wireless"}[5m])*60)\u0026start={{startTime}}\u0026end={{endTime}}\u0026step={{step}}',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{connectivityType!="wireless"}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{connectivityType!="wireless"}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'time-series',
				title: 'Wired Throughput'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'throughput-wireless',
				resourceVersion: '188099',
				selfLink: '/apis/ws.io/v1/dashboardqueries/throughput-wireless',
				uid: '2b0512d2-f778-49de-b6a5-748604c94bec'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query_range?query=sum(rate(endpoint_rx_bytes{connectivityType="wireless"}[5m])*60%2Brate(endpoint_tx_bytes{connectivityType="wireless"}[5m])*60)\u0026start={{startTime}}\u0026end={{endTime}}\u0026step={{step}}',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{connectivityType="wireless"}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{connectivityType="wireless"}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'time-series',
				title: 'Wireless Throughput',
				x_axis_label: 'Throughput'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'traffic-by-app-category',
				resourceVersion: '188077',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-app-category',
				uid: '3fbc2459-8206-4bd9-ac95-5de6292992ef'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(appCategory)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{appCategory={{APPCATEGORY}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{appCategory={{APPCATEGORY}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by Application Category'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'traffic-by-app-name',
				resourceVersion: '188097',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-app-name',
				uid: '09128bbd-06c4-444d-8d16-e707bba52fad'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(appName)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{appName={{APPNAME}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{appName={{APPNAME}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by Application'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'traffic-by-os',
				resourceVersion: '188073',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-os',
				uid: '74ffa176-3309-4ae1-82fa-28224c55b6f8'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(os)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{os={{OS}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{os={{OS}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by OS'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'traffic-by-room',
				resourceVersion: '188085',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-room',
				uid: 'bd72be4e-29ad-4396-8761-f692aff26371'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(room)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{room={{ROOM}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{room={{ROOM}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by Room'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:21Z',
				generation: 1,
				name: 'traffic-by-suite',
				resourceVersion: '188105',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-suite',
				uid: '71860a71-3170-4c01-acaf-086c81d33296'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(suite)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{suite={{SUITE}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{suite={{SUITE}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by Suite'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'traffic-by-vendor',
				resourceVersion: '188089',
				selfLink: '/apis/ws.io/v1/dashboardqueries/traffic-by-vendor',
				uid: 'e789ba71-59b9-401b-8aac-ad3bfb8cd909'
			},
			spec: {
				all_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}])',
				base_url:
					'api/v1/query?query=sum(increase(endpoint_rx_bytes[{{DURATION}}])%2Bincrease(endpoint_tx_bytes[{{DURATION}}]))by(vendor)',
				filtered_data_url:
					'api/v1/query?query=increase(endpoint_rx_bytes{vendor={{VENDOR}}}[{{DURATION}}])%2Bincrease(endpoint_tx_bytes{vendor={{VENDOR}}}[{{DURATION}}])',
				params: '',
				port: 9090,
				query_category: 'discrete-data',
				title: 'Traffic by Vendor'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:17Z',
				generation: 1,
				name: 'wired-endpoint-count',
				resourceVersion: '188075',
				selfLink: '/apis/ws.io/v1/dashboardqueries/wired-endpoint-count',
				uid: 'e4137bac-5e75-459e-8a65-ad0e55686c9a'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{connectivityType!="wireless"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{connectivityType!="wireless"})',
				port: 9090,
				query_category: 'summary',
				title: 'Wired Endpoints'
			}
		},
		{
			apiVersion: 'ws.io/v1',
			kind: 'DashboardQuery',
			metadata: {
				creationTimestamp: '2020-02-25T02:41:18Z',
				generation: 1,
				name: 'wireless-endpoint-count',
				resourceVersion: '188081',
				selfLink: '/apis/ws.io/v1/dashboardqueries/wireless-endpoint-count',
				uid: 'c3afd4e7-d537-49a8-8e84-1616049f84f4'
			},
			spec: {
				all_data_url:
					'api/v1/query_range?query=count(endpoint_state{connectivityType="wireless"})\u0026start=\u003cSTARTTIME\u003e\u0026end=\u003cENDTIME\u003e\u0026step=\u003cSTEP\u003e',
				base_url: 'api/v1/query?query=count(endpoint_state{connectivityType="wireless"})',
				port: 9090,
				query_category: 'summary',
				title: 'Wireless Endpoints'
			}
		}
	],
	kind: 'DashboardQueryList',
	metadata: { continue: '', resourceVersion: '210791', selfLink: '/apis/ws.io/v1/dashboardqueries' }
};
