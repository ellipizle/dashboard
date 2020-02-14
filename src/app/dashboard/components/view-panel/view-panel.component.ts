import { Component, OnInit } from '@angular/core';
import { Widget } from '../../../widget/interfaces/widget';
import { MatDialog } from '@angular/material';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { Router } from '@angular/router';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';
@Component({
	selector: 'app-view-panel',
	templateUrl: './view-panel.component.html',
	styleUrls: [ './view-panel.component.scss' ]
})
export class ViewPanelComponent implements OnInit {
	widget: Widget;
	constructor(private router: Router, private _dialog: MatDialog, private dashboard: DashboardService) {
		this.dashboard.getSelectedItemObs().subscribe((res) => {
			console.log(res);
			this.widget = res;
		});
	}
	public viewWidget(widget: Widget) {
		this.router.navigate([ 'dashboard' ]);
	}

	public removeWidget(widget: Widget) {
		this.router.navigate([ 'dashboard' ]);
	}
	public editWidget(widget: Widget) {
		console.log(widget);
		const dialogRef = this._dialog.open(WidgetDialogComponent, {
			width: '600px',
			data: widget
		});

		dialogRef.afterClosed().subscribe((res) => {
			// if (res) {
			// 	this.items.filter((item) => {
			// 		if (item.id == res.id) {
			// 			return res;
			// 		}
			// 	});
			// 	for (let i = 0; i < this.items.length; i++) {
			// 		if (this.items[i].id == res.id) {
			// 			this.items[i] = res;
			// 		}
			// 	}
			// }
		});
	}

	ngOnInit() {}
}
