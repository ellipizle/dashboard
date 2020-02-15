import {
	ChangeDetectionStrategy,
	SimpleChanges,
	ViewChild,
	Component,
	OnInit,
	ViewEncapsulation,
	HostListener
} from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { GridsterConfig } from 'angular-gridster2';
import { Widget } from '../../../widget';
import { LayoutService } from '../../../shared/services/layout.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { DialogService } from '../../../shared/dialog/dialog.service';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent {
	// @ViewChild('gridsterItem') gridItem: GridsterItemComponent;
	query = `100 - ((node_filesystem_avail_bytes{instance=~"localhost:9100",job=~"node_exporter",device!~'rootfs'} * 100) / node_filesystem_size_bytes{instance=~"localhost:9100",job=~"node_exporter",device!~'rootfs'})`;

	get options(): GridsterConfig {
		return this.layoutService.options;
	}
	get layout(): Widget[] {
		return this.layoutService.layout;
	}

	constructor(
		private layoutService: LayoutService,
		private _dialog: MatDialog,
		private dialogService: DialogService,
		private dashboardSvc: DashboardService,
		private router: Router
	) {
		//get queries
		this.dashboardSvc.getQueries().subscribe((res) => {
			this.dashboardSvc.setQueriesObs(res['items']);
		});

		//get charts
		this.dashboardSvc.getCharts().subscribe((res) => {
			this.dashboardSvc.setChartsObs(res['items']);
		});
	}

	public removeWidget(widget: Widget) {
		console.log('console view widget ', widget);
		this.dialogService
			.openConfirmDialog({ title: 'Remove Panel', msg: 'Are you sure you want to remove panel?' })
			.afterClosed()
			.subscribe((res) => {
				if (res) {
					this.layoutService.deleteItem(widget.id);
				}
			});
	}

	public viewWidget(widget: Widget) {
		this.dashboardSvc.setSelectedItemObs(widget);
		this.router.navigate([ 'dashboard', widget.id ]);
	}

	public editWidget(widget: Widget) {
		const dialogRef = this._dialog.open(WidgetDialogComponent, {
			width: '600px',
			data: widget
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				this.layoutService.editItem(res);
			}
		});
	}
}
