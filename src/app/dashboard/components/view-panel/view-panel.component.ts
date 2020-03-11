import { Component, OnInit } from '@angular/core';
import { Widget } from '../../../widget/interfaces/widget';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Router } from '@angular/router';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';
import { JsonDialogComponent } from '../../../shared/json-dialog/json-dialog.component';
import { LayoutService } from '../../../shared/services/layout.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
@Component({
	selector: 'app-view-panel',
	templateUrl: './view-panel.component.html',
	styleUrls: [ './view-panel.component.scss' ]
})
export class ViewPanelComponent implements OnInit {
	widget: Widget;
	filter: string;
	resetDataSource: any;
	constructor(
		private dialogService: DialogService,
		private layoutService: LayoutService,
		private router: Router,
		private _dialog: MatDialog,
		private dashboard: DashboardService
	) {
		this.layoutService.getSelectedItemObs().subscribe((res) => {
			if (res) {
				this.widget = { ...res };
				setTimeout(() => {
					this.resetDataSource = Math.random();
				}, 2000);
			}
		});
	}

	public onFilter(filter: string) {
		console.log('in view panel fiter', filter);
		this.filter = filter;
	}

	public jsonWidget(widget: Widget) {
		const dialogRef = this._dialog.open(JsonDialogComponent, {
			width: '1000px',
			data: widget,
			panelClass: 'json-panel'
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				// this.layoutService.editItem(res);
			}
		});
	}
	public viewWidget(widget: Widget) {
		this.router.navigate([ 'dashboard' ]);
	}

	public removeWidget(widget: Widget) {
		this.dialogService
			.openConfirmDialog({ title: 'Remove Panel', msg: 'Are you sure you want to remove panel?' })
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					this.layoutService.deleteItem(widget.id);
					this.router.navigate([ 'dashboard' ]);
				}
			});
	}
	public editWidget(widget: Widget) {
		const dialogRef = this._dialog.open(WidgetDialogComponent, {
			width: '600px',
			data: widget
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				if (res) {
					this.widget = { ...res };
					this.layoutService.editItem(res);
					console.log(this.widget, 'After edit');
					// this.resetDataSource = Math.random();
				}
			}
		});
	}

	ngOnInit() {}
}
