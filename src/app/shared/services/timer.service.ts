import { Injectable } from '@angular/core';
import { Observable, timer, NEVER, BehaviorSubject, Subject } from 'rxjs';
import { map, scan, tap, takeUntil, takeWhile, switchMap } from 'rxjs/operators';
@Injectable({
	providedIn: 'root'
})
export class TimerService {
	public refresh$ = new Subject();
	public dateRange$ = new BehaviorSubject(false);
	public timer$ = new BehaviorSubject(false);
	private unsubscribe$: Subject<void> = new Subject<void>();
	constructor() {}

	getDateRangeObs(): Observable<any> {
		return this.dateRange$.asObservable();
	}

	setDateRangeObs(range: any) {
		this.dateRange$.next(range);
	}

	getRefreshObs(): Observable<any> {
		return this.refresh$.asObservable();
	}

	setRefreshObs(interval: any) {
		this.refresh$.next(interval);
	}

	getIntervalObs(): Observable<any> {
		return this.timer$.asObservable();
	}

	setIntervalObs(interval: any) {
		this.timer$.next(interval);
	}
}
