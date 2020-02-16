export const data = {
	status: 'success',
	data: {
		resultType: 'vector',
		result: [
			{ metric: { os: 'Windows8' }, value: [ 1581724296.639, '1' ] },
			{ metric: { os: 'Linux' }, value: [ 1581724296.639, '3' ] },
			{ metric: { os: '12.11' }, value: [ 1581724296.639, '1' ] }
		]
	}
};
// http://ec2-54-241-135-160.us-west-1.compute.amazonaws.com:9090/api/v1/query_range?query=sum(rate(endpoint_rx_bytes[5m])*60%2Brate(endpoint_tx_bytes[5m])*60)&start=1581722395&end=1581723395&step=15
