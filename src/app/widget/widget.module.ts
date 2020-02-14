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

const COMPONENTS = [
	BarChartComponent,
	LineChartComponent,
	GuargeComponent,
	AreaStackComponent,
	BarAnimationComponent,
	PieComponent,
	BarComponent
];
@NgModule({
	declarations: [ ...COMPONENTS ],
	imports: [ SharedModule ],
	exports: [ ...COMPONENTS ]
})
export class WidgetModule {}
