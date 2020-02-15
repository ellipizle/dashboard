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
	items = [
		{ x: 0, y: 0, rows: 4, cols: 5, id: 'qwas23', title: 'Pie', type: 'pie' },
		{ x: 0, y: 0, rows: 2, cols: 7, id: 'qwas23', title: 'Area Chart', type: 'area' },
		{ x: 0, y: 0, rows: 2, cols: 7, id: 'qwas23', title: 'Bar', type: 'bar' },
		{ x: 0, y: 0, rows: 2, cols: 12, id: 'qwas23', title: 'Bar Animation', type: 'bar-animation' }
	];
	public layout: Array<Widget> = [];
	public options: GridsterConfig = {
		// itemChangeCallback: this.itemChange.bind(this),
		// itemResizeCallback: this.itemResize.bind(this),
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

	constructor() {}

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
