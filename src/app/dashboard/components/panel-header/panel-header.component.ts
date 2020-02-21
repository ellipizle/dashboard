import { ViewChild, Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
	selector: 'app-panel-header',
	templateUrl: './panel-header.component.html',
	styleUrls: [ './panel-header.component.scss' ]
})
export class PanelHeaderComponent implements OnInit {
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	menuToggle: boolean;
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
