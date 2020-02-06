import { ChangeDetectionStrategy, SimpleChanges, ViewChild, Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { BaseWidget, EditWidgetDialogComponent } from '../../../widget';
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
	public items: Array<BaseWidget>;
	sampleData: any;

	constructor(private _dialog: MatDialog) {
		this.unitHeight = 0;
		this.items = [
			{ x: 0, y: 0, rows: 2, cols: 3, id: 'aoie23', title: 'Disk Usage', type: 'guarge' },
			{ x: 0, y: 0, rows: 2, cols: 9, id: 'qwas23', title: 'Memory', type: 'bar' }
		];
		this.options = {
			itemResizeCallback: this.itemResize.bind(this),
			pushItems: true,
			minCols: 12,
			maxCols: 12,
			minRows: 5,
			fixedRowHeight: 120,
			gridType: 'scrollVertical',
			displayGrid: DisplayGrid.None,
			// fixedColWidth: number;
			// keepFixedHeightInMobile: boolean,
			// keepFixedWidthInMobile?: boolean,
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

	public ngOnChanges(changes: SimpleChanges): void {
		if (this.options.api) {
			this.options.api.optionsChanged();
		}
		if (this.gridItem && this.gridItem.gridster.curRowHeight > 1) {
			this.unitHeight = this.gridItem.gridster.curRowHeight;
		}
	}

	public viewWidget(widget: BaseWidget) {
		console.log(widget);
	}

	public editWidget(widget: BaseWidget) {
		console.log(widget);
		const dialogRef = this._dialog.open(EditWidgetDialogComponent, {
			width: '600px',
			data: widget
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				//update ites
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
