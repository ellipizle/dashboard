import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { LineChartComponent } from './components/line-chart/line-chart.component';
import { AreaStackComponent } from './components/area-stack/area-stack.component';
import { BarAnimationComponent } from './components/bar-animation/bar-animation.component';
import { PieComponent } from './components/pie/pie.component';
import { BarComponent } from './components/bar/bar.component';
import { BarHorizontalComponent } from './components/bar-horizontal/bar-horizontal.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { GaugeChartComponent } from './components/gauge-chart/gauge-chart.component';
import { TableComponent } from './components/table/table.component';
import { TableBarComponent } from './components/table/table-bar';
import { TablePieComponent } from './components/table/table-pie';
import { TableSummaryComponent } from './components/table/table-summary';
import { TableSummaryChartComponent } from './components/table/table-summary-chart';
import { SummaryComponent } from './components/summary/summary.component';
import { SummaryItemComponent } from './components/summary/summary-item';
import { SummaryChartItemComponent } from './components/summary-chart/summary-chart-item';
import { SummaryChartComponent } from './components/summary-chart/summary-chart.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { GaugeModule } from 'angular-gauge';
import { GaugeChartModule } from 'angular-gauge-chart';
const COMPONENTS = [
	LineChartComponent,
	AreaStackComponent,
	BarAnimationComponent,
	PieComponent,
	BarComponent,
	DonutChartComponent,
	GaugeChartComponent,
	TableComponent,
	TableBarComponent,
	TableSummaryComponent,
	SummaryComponent,
	SummaryItemComponent,
	TablePieComponent,
	BarHorizontalComponent,
	SummaryChartItemComponent,
	SummaryChartComponent,
	TableSummaryChartComponent
];
@NgModule({
	declarations: [ ...COMPONENTS ],
	imports: [ SharedModule, GaugeModule.forRoot() ],
	exports: [ ...COMPONENTS ]
})
export class WidgetModule {}
