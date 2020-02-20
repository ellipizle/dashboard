import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Widget } from '../../widget/interfaces/widget';
@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	baseUrl: string = environment.baseUrl;
	selectedItem: BehaviorSubject<Widget | null> = new BehaviorSubject(null);
	queries: BehaviorSubject<any[]> = new BehaviorSubject([]);
	charts: BehaviorSubject<any[]> = new BehaviorSubject([]);

	constructor(private http: HttpClient) {}

	getSelectedItemObs(): Observable<Widget | null> {
		return this.selectedItem.asObservable();
	}

	setSelectedItemObs(selectedItem: any) {
		this.selectedItem.next(selectedItem);
	}

	getQueriesObs(): Observable<any[]> {
		return this.queries.asObservable();
	}

	setQueriesObs(queries: any) {
		this.queries.next(queries);
	}

	getChartsObs(): Observable<any[]> {
		return this.charts.asObservable();
	}

	setChartsObs(queries: any) {
		this.charts.next(queries);
	}

	getQueries() {
		return this.http.get(`${this.baseUrl}apis/ws.io/v1/dashboardqueries`);
	}

	getCharts() {
		return this.http.get(`${this.baseUrl}apis/ws.io/v1/dashboardcharts`);
	}

	saveDashboard(payload) {
		return this.http.post(`${this.baseUrl}apis/ws.io/v1/usersettings/dashboard-user1`, payload);
	}
	getDashboard() {
		return this.http.get(`${this.baseUrl}apis/ws.io/v1/usersettings/dashboard-user1`);
	}
}
