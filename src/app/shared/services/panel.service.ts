import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
	providedIn: 'root'
})
export class PanelService {
	baseUrl: string = environment.promeUrl;
	milliseconds = new Date().getTime();
	constructor(private http: HttpClient) {}

	getPanelData(query) {
		return this.http.get(`${this.baseUrl}${query}`);
	}
}
