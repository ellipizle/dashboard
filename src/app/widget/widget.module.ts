import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { GuargeComponent } from './components/guarge/guarge.component';

import { AreaStackComponent } from './components/area-stack/area-stack.component';
import { BarAnimationComponent } from './components/bar-animation/bar-animation.component';
import { PieComponent } from './components/pie/pie.component';
import { BarComponent } from './components/bar/bar.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';

import { GaugeChartModule } from 'angular-gauge-chart';
import { TableComponent } from './components/table/table.component';
import { TableSummaryComponent } from './components/table/table-summary';
import { SummaryComponent } from './components/summary/summary.component';
import { SummaryItemComponent } from './components/summary/summary-item';

const COMPONENTS = [
	BarChartComponent,
	LineChartComponent,
	GuargeComponent,
	AreaStackComponent,
	BarAnimationComponent,
	PieComponent,
	BarComponent,
	DonutChartComponent,
	GaugeChartComponent,
	TableComponent,
	TableSummaryComponent,
	SummaryComponent,
	SummaryItemComponent
];
@NgModule({
	declarations: [ ...COMPONENTS ],
	imports: [ SharedModule, GaugeChartModule ],
	exports: [ ...COMPONENTS ]
})
export class WidgetModule {}
