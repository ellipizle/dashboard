import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
	providedIn: 'root'
})
export class DatasourceService {
	//prometheus endpoint
	url: string = 'http://localhost:9090/api/v1/query_range?query=';
	constructor(private http: HttpClient) {}

	getMetric(query) {
		return this.http.get(`${this.url}${query}`);
	}
}
