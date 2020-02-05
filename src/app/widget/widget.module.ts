import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { GuargeComponent } from './components/guarge/guarge.component';
import { EditWidgetDialogComponent } from './components/edit-widget-dialog/edit-widget-dialog.component';
const COMPONENTS = [ EditWidgetDialogComponent, BarChartComponent, LineChartComponent, GuargeComponent ];
@NgModule({
	declarations: [ ...COMPONENTS ],
	imports: [ SharedModule ],
	exports: [ ...COMPONENTS ],
	entryComponents: [ EditWidgetDialogComponent ]
})
export class WidgetModule {}
