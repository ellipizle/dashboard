import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from '../services/dashboard.service';
import { v4 as uuid } from 'uuid';
import { ChartType, Query } from '../../widget/interfaces/widget';
@Component({
	selector: 'app-widget-dialog',
	templateUrl: './widget-dialog.component.html',
	styleUrls: [ './widget-dialog.component.scss' ]
	// encapsulation: ViewEncapsulation.None
})
export class WidgetDialogComponent implements OnInit {
	formSubmitted: boolean;
	queryOption: Array<Query> = [];
	chartsOption: Array<ChartType> = [];
	queryTypes: Array<Query> = [];
	maxCount: number = 0;
	widgetForm = this._fb.group({
		id: [ uuid() ],
		title: [ '', Validators.required ],
		// query: [ [], Validators.required ],
		query: this._fb.array([]),
		type: [ '', Validators.required ]
	});

	constructor(
		private _fb: FormBuilder,
		public dialogRef: MatDialogRef<WidgetDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public formData,
		private dashboardSvc: DashboardService
	) {
		this.dashboardSvc.getQueriesObs().subscribe((res) => {
			if (res) this.queryOption = res;
		});

		this.dashboardSvc.getChartsObs().subscribe((res) => {
			if (res) this.chartsOption = res;
		});
		this.widgetForm.get('type').valueChanges.subscribe((val: any) => {
			this.queryTypes = this.queryOption.filter((type) => type.spec.query_category === val.spec.category);
			this.maxCount = val.spec.max_queries ? val.spec.max_queries : 1;
			this.clearItem();
		});
	}

	onSelected($event) {
		// console.log(this.queryTypes);
		// console.log($event);
		// console.log(this.queryTypes.filter((type) => type.spec.query_category === $event.spec.query_category));
		// let arr = [ ...this.queryTypes ];
		// this.queryTypes = arr.filter((type) => type.spec.query_category != $event.spec.query_category);
	}
	clearItem() {
		const control = <FormArray>this.widgetForm.controls['query'];
		while (control.length) {
			control.removeAt(0);
		}
	}

	addItem() {
		const control = <FormArray>this.widgetForm.controls['query'];
		const addrCtrl = this.initAction();
		control.push(addrCtrl);
		this.maxCount--;
		console.log(this.maxCount);
	}

	removeItem(i: number) {
		const control = <FormArray>this.widgetForm.controls['query'];
		control.removeAt(i);
		this.maxCount++;
		console.log(this.maxCount);
	}

	initAction() {
		return this._fb.group({
			query: [ '' ]
		});
	}
	ngOnInit() {
		if (this.formData) {
			let data = {
				id: this.formData.id,
				title: this.formData.title,
				type: this.formData.type
			};
			this.widgetForm.patchValue(data);
			this.transformItem(this.formData.query);
		}
	}

	transformItem(query) {
		const control = <FormArray>this.widgetForm.controls['query'];
		while (control.length) {
			control.removeAt(0);
		}
		query.forEach((term) => {
			control.push(
				this._fb.group({
					query: [ term ]
				})
			);
		});
	}

	submitForm() {
		this.formSubmitted = false;
		if (this.widgetForm.valid) {
			let realValue = this.widgetForm.value;
			realValue['query'] = this.widgetForm.value.query.map((item) => item.query);
			if (this.formData) {
				this.dialogRef.close({ ...this.formData, ...realValue });
			} else {
				this.dialogRef.close({ ...realValue, ...{ x: 0, y: 0, rows: 4, cols: 5 } });
			}
		} else {
			this.formSubmitted = true;
		}
	}
}
