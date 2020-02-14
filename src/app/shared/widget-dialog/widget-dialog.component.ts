import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from '../services/dashboard.service';
import { v4 as uuid } from 'uuid';
@Component({
	selector: 'app-widget-dialog',
	templateUrl: './widget-dialog.component.html',
	styleUrls: [ './widget-dialog.component.scss' ]
})
export class WidgetDialogComponent implements OnInit {
	charts = [ { name: 'Bar', value: 'bar' }, { name: 'Guarge', value: 'guarge' }, { name: 'Line', value: 'line' } ];
	queryOption = [];
	chartsOption = [];
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
			this.queryOption = res;
		});

		this.dashboardSvc.getChartsObs().subscribe((res) => {
			this.chartsOption = res;
		});
	}

	ngOnInit() {
		console.log('new uid: ');
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
		if (this.formData) {
			this.dialogRef.close({ ...this.formData, ...this.widgetForm.value });
		} else {
			this.dialogRef.close({ ...this.formData, ...{ x: 0, y: 0, rows: 4, cols: 5 } });
		}
	}
}
