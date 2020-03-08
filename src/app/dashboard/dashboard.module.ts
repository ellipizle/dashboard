import { NgModule } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { WidgetModule } from '../widget/widget.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboaradRoutingModule } from './dashboard-routing.module';
import { PanelHeaderComponent } from './components/panel-header/panel-header.component';
import { PanelViewHeaderComponent } from './components/view-panel-header/view-panel-header.component';
import { ViewPanelComponent } from './components/view-panel/view-panel.component';
@NgModule({
	declarations: [ DashboardComponent, PanelHeaderComponent, PanelViewHeaderComponent, ViewPanelComponent ],
	exports: [ DashboardComponent ],
	imports: [ SharedModule, WidgetModule, HttpClientModule, GridsterModule, DashboaradRoutingModule ]
})
export class DashboardModule {}
