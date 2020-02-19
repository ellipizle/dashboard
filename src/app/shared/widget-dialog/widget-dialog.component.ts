import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from '../services/dashboard.service';
import { v4 as uuid } from 'uuid';
import { ChartType, Query } from '../../widget/interfaces/widget';
@Component({
	selector: 'app-widget-dialog',
	templateUrl: './widget-dialog.component.html',
	styleUrls: [ './widget-dialog.component.scss' ]
})
export class WidgetDialogComponent implements OnInit {
	formSubmitted: boolean;
	queryOption: Array<Query> = [];
	chartsOption: Array<ChartType> = [];
	chartsTypes: Array<ChartType> = [];
	widgetForm = this._fb.group({
		id: [ uuid() ],
		title: [ '', Validators.required ],
		query: [ '', Validators.required ],
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
		this.widgetForm.get('query').valueChanges.subscribe((val: any) => {
			this.chartsTypes = this.chartsOption.filter((type) => type.spec.category === val.spec.query_category);
		});
	}

	ngOnInit() {
		if (this.formData) {
			let data = {
				id: this.formData.id,
				title: this.formData.title,
				query: this.formData.query,
				type: this.formData.type
			};
			this.widgetForm.patchValue(data);
		}
	}

	submitForm() {
		this.formSubmitted = false;
		if (this.widgetForm.valid) {
			if (this.formData) {
				this.dialogRef.close({ ...this.formData, ...this.widgetForm.value });
			} else {
				this.dialogRef.close({ ...this.widgetForm.value, ...{ x: 0, y: 0, rows: 4, cols: 5 } });
			}
		} else {
			this.formSubmitted = true;
		}
	}
}
