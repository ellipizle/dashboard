import { Injectable } from '@angular/core';
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
import { Widget } from '../../widget/interfaces/widget';
@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	unitHeight;
	public itemResize(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
		// if (itemComponent.gridster.curRowHeight > 1) {
		// 	this.unitHeight = itemComponent.gridster.curRowHeight;
		// }
		// itemComponent.gridster.curRowHeight += (item.cols * 100 - item.rows) / 10000;
	}
	public layout: Array<Widget> = [];
	public options: GridsterConfig = {
		// itemChangeCallback: this.itemChange.bind(this),
		// itemResizeCallback: this.itemResize.bind(this),
		pushItems: true,
		minCols: 12,
		maxCols: 12,
		// row: 200,
		// minRows: 5,
		// fixedRowHeight: 120,
		// keepFixedHeightInMobile: true,
		// fixedRowHeight: -1,
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

	constructor() {
		// this.layout = this.items;
	}
	changedOptions() {
		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
	}
	deleteItem(id: string): void {
		const item = this.layout.find((d) => d.id === id);
		this.layout.splice(this.layout.indexOf(item), 1);
	}
	addItem(widget: Widget): void {
		this.layout.push(widget);
	}
	editItem(widget: Widget): void {
		for (let i = 0; i < this.layout.length; i++) {
			if (this.layout[i].id == widget.id) {
				this.layout[i] = widget;
			}
		}
	}
}
