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
			if (res && res.length > 0) {
				this.queryOption = res;
			} else {
				this.queryOption = JSON.parse(localStorage.getItem('queries'));
			}
		});

		this.dashboardSvc.getChartsObs().subscribe((res) => {
			if (res && res.length > 0) {
				this.chartsOption = res;
			} else {
				this.chartsOption = JSON.parse(localStorage.getItem('charts'));
			}
		});
		this.widgetForm.get('type').valueChanges.subscribe((val: any) => {
			let chart = this.chartsOption.find((chart) => chart.metadata.name === val);
			this.queryTypes = this.queryOption.filter((type) => type.spec.query_category === chart.spec.category);
			this.maxCount = chart.spec.max_queries ? chart.spec.max_queries : 1;
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
	}

	removeItem(i: number) {
		const control = <FormArray>this.widgetForm.controls['query'];
		control.removeAt(i);
		this.maxCount++;
	}

	initAction() {
		return this._fb.group({
			query: [ '', Validators.required ]
		});
	}
	ngOnInit() {
		if (this.formData) {
			let data = {
				id: this.formData.id,
				title: this.formData.title,
				type: this.formData.type.metadata.name
			};
			this.widgetForm.patchValue(data);
			this.maxCount = this.formData.type.spec.max_queries ? this.formData.type.spec.max_queries : 1;
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
					query: [ term.metadata.name ]
				})
			);
			this.maxCount--;
		});
	}

	submitForm() {
		this.formSubmitted = false;
		if (this.widgetForm.valid) {
			let realValue = this.widgetForm.value;
			realValue['type'] = this.chartsOption.find((chart) => chart.metadata.name === realValue.type);
			let queries = this.widgetForm.value.query.map((item) => item.query);
			let queriesObject = [];
			queries.forEach((query) => {
				queriesObject.push(this.queryOption.find((option) => option.metadata.name === query));
			});
			realValue['query'] = queriesObject;
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
