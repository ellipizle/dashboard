import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DARK_THEME, DEFAULT_THEME, Dark_echarts, Default_echarts } from '../theme';
@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	selectedTheme: BehaviorSubject<any> = new BehaviorSubject({ echart: Default_echarts, theme: DEFAULT_THEME });
	// selectedTheme: BehaviorSubject<any> = new BehaviorSubject({ echart: Dark_echarts, theme: DARK_THEME });
	constructor() {}

	getSelectedThemeObs(): Observable<any[]> {
		return this.selectedTheme.asObservable();
	}

	setSelectedThemeObs(queries: any) {
		this.selectedTheme.next(queries);
	}
}
