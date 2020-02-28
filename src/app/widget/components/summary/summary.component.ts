import {
	Component,
	OnInit,
	HostListener,
	AfterViewInit,
	ChangeDetectorRef,
	Input,
	ElementRef,
	OnDestroy
} from '@angular/core';
import { Widget } from '../../interfaces/widget';
import { PanelService } from '../../../shared/services/panel.service';
@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: [ './summary.component.scss' ]
})
export class SummaryComponent implements OnInit {
	@Input() public item: Widget;
	constructor(private panelService: PanelService) {}

	ngOnInit() {}
}
