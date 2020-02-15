import { Injectable } from '@angular/core';
import { Observable, timer, NEVER, BehaviorSubject, Subject } from 'rxjs';
import { map, scan, tap, takeUntil, takeWhile, switchMap } from 'rxjs/operators';
@Injectable({
	providedIn: 'root'
})
export class TimerService {
	private timer$ = new BehaviorSubject(false);
	private unsubscribe$: Subject<void> = new Subject<void>();
	running: boolean = false; // running state;
	_timeSpent: number;
	_timeRemaining: any;
	timeTotal: number = 1800; // 30min in seconds;
	interval = 1000; // 1 seconds

	animateValue: any = '';
	constructor() {}

	initTimer() {
		this.timer$
			.pipe(
				switchMap((running: boolean) => (running ? timer(0, this.interval) : NEVER)),
				scan((acc) => acc - 1, this._timeRemaining ? this._timeRemaining : this.timeTotal),
				tap((timeValue) => this.computeTiming(timeValue)),
				takeWhile((timeRemaining) => timeRemaining > 0),
				takeUntil(this.unsubscribe$)
			)
			.subscribe((value) => {
				// this.calculateLoaderTime();
			});
	}

	computeTiming(timeValue) {
		this._timeRemaining = timeValue;
		this._timeSpent = this.timeTotal - this._timeRemaining;
		if (this._timeSpent == this.timeTotal) {
			// this.updateTimeSpent.emit(this._todo)
		}
	}
}
