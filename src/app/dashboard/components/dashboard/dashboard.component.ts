import {
	ChangeDetectionStrategy,
	SimpleChanges,
	ViewChild,
	Component,
	OnInit,
	ViewEncapsulation,
	HostListener
} from '@angular/core';
import { graphic } from 'echarts';
import {
	CompactType,
	GridsterConfig,
	GridsterItem,
	GridsterItemComponentInterface,
	GridsterItemComponent,
	GridsterPush,
	GridType,
	DisplayGrid
} from 'angular-gridster2';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Widget } from '../../../widget';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { WidgetDialogComponent } from '../../../shared/widget-dialog/widget-dialog.component';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent {
	@ViewChild('gridsterItem') gridItem: GridsterItemComponent;
	query = `100 - ((node_filesystem_avail_bytes{instance=~"localhost:9100",job=~"node_exporter",device!~'rootfs'} * 100) / node_filesystem_size_bytes{instance=~"localhost:9100",job=~"node_exporter",device!~'rootfs'})`;
	public options: GridsterConfig;
	public unitHeight: number;
	public items: Array<Widget>;
	sampleData: any;

	@HostListener('window:resize', [ '$event' ])
	onResize(event) {
		// event.target.innerWidth;
		console.log('on resize');
		this.options.api.resize();
	}

	constructor(private _dialog: MatDialog, private dashboardSvc: DashboardService, private router: Router) {
		this.dashboardSvc.getQueries().subscribe((res) => {
			console.log(res);
		});
		this.dashboardSvc.getCharts().subscribe((res) => {
			console.log(res);
		});
		this.unitHeight = 0;
		this.items = [
			{ x: 0, y: 0, rows: 4, cols: 5, id: 'qwas23', title: 'Pie', type: 'pie' },
			{ x: 0, y: 0, rows: 2, cols: 7, id: 'qwas23', title: 'Area Chart', type: 'area' },
			{ x: 0, y: 0, rows: 2, cols: 7, id: 'qwas23', title: 'Bar', type: 'bar' },
			{ x: 0, y: 0, rows: 2, cols: 12, id: 'qwas23', title: 'Bar Animation', type: 'bar-animation' }
		];
		this.options = {
			itemChangeCallback: this.itemChange.bind(this),
			itemResizeCallback: this.itemResize.bind(this),
			pushItems: true,
			minCols: 12,
			maxCols: 12,
			minRows: 5,
			// fixedRowHeight: 120,
			gridType: 'scrollVertical',
			displayGrid: DisplayGrid.None,
			// fixedColWidth: number;
			// keepFixedHeightInMobile: true,
			// keepFixedWidthInMobile: true,
			// compactType?: compactTypes;
			// maxRows?: number;
			// defaultItemCols?: number;
			// defaultItemRows?: number;
			// maxItemCols?: number;
			// maxItemRows?: number;
			// minItemCols?: number;
			// minItemRows?: number;
			// minItemArea?: number;
			// maxItemArea?: number;
			// resizable?: Resizable;
			// disableWindowResize: true,
			// disableScrollHorizontal?: boolean;
			// disableScrollVertical?: boolean;
			resizable: {
				enabled: true
			},
			draggable: {
				enabled: true
			}
		};
	}
	public itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
		if (itemComponent.gridster.curRowHeight > 1) {
			this.unitHeight = itemComponent.gridster.curRowHeight;
		}
		itemComponent.gridster.curRowHeight += (item.cols * 100 - item.rows) / 10000;
	}
	public itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
		console.log('on grid resize');
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.options.api) {
			this.options.api.optionsChanged();
		}
		if (this.gridItem && this.gridItem.gridster.curRowHeight > 1) {
			this.unitHeight = this.gridItem.gridster.curRowHeight;
		}
	}

	public removeWidget(widget: Widget) {
		console.log('console view widget ', widget);
	}

	public viewWidget(widget: Widget) {
		this.dashboardSvc.setSelectedItemObs(widget);
		this.router.navigate([ 'dashboard', widget.id ]);
	}

	public editWidget(widget: Widget) {
		console.log(widget);
		const dialogRef = this._dialog.open(WidgetDialogComponent, {
			width: '600px',
			data: widget
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				console.log(res);
				this.items.filter((item) => {
					if (item.id == res.id) {
						return res;
					}
				});
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].id == res.id) {
						this.items[i] = res;
					}
				}
			}
		});
	}
}
