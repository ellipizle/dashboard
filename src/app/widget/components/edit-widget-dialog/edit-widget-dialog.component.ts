import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-edit-widget-dialog',
	templateUrl: './edit-widget-dialog.component.html',
	styleUrls: [ './edit-widget-dialog.component.scss' ]
})
export class EditWidgetDialogComponent implements OnInit {
	charts = [ { name: 'Bar', value: 'bar' }, { name: 'Guarge', value: 'guarge' }, { name: 'Line', value: 'line' } ];
	widgetForm = this._fb.group({
		title: [ '', Validators.required ],
		query: [ '' ],
		type: [ '' ]
	});

	constructor(
		private _fb: FormBuilder,
		public dialogRef: MatDialogRef<EditWidgetDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public formData
	) {}

	ngOnInit() {
		if (this.formData) {
			let data = {
				title: this.formData.title,
				query: this.formData.query,
				type: this.formData.type
			};
			this.widgetForm.patchValue(data);
		}
	}

	submitForm() {
		// let data: any = {
		// 	formValue: this.widgetForm.value
		// };
		this.dialogRef.close({ ...this.formData, ...this.widgetForm.value });
	}
}
