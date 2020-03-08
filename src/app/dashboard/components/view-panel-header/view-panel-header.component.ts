import { ViewChild, Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
	selector: 'app-view-panel-header',
	templateUrl: './view-panel-header.component.html',
	styleUrls: [ './view-panel-header.component.scss' ]
})
export class PanelViewHeaderComponent implements OnInit {
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	menuToggle: boolean;
	detailView: boolean;
	@Input() item: any;
	@Output() edit: any = new EventEmitter();
	@Output() view: any = new EventEmitter();
	@Output() panelJson: any = new EventEmitter();
	@Output() remove: any = new EventEmitter();

	constructor() {}

	ngOnInit() {}
	open() {
		this.trigger.openMenu();
	}
}
