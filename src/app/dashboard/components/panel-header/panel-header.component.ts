import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-panel-header',
	templateUrl: './panel-header.component.html',
	styleUrls: [ './panel-header.component.scss' ]
})
export class PanelHeaderComponent implements OnInit {
	menuToggle: boolean;
	@Input() item: any;
	@Output() edit: any = new EventEmitter();
	@Output() view: any = new EventEmitter();
	@Output() panelJson: any = new EventEmitter();
	@Output() remove: any = new EventEmitter();

	constructor() {}

	ngOnInit() {}
}
