import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { WidgetModule } from '../widget/widget.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboaradRoutingModule } from './dashboard-routing.module';

@NgModule({
	declarations: [ DashboardComponent ],
	exports: [ DashboardComponent ],
	imports: [ SharedModule, WidgetModule, HttpClientModule, GridsterModule, DashboaradRoutingModule ]
})
export class DashboardModule {}
