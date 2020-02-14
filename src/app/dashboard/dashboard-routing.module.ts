import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewPanelComponent } from './components/view-panel/view-panel.component';

const routes: Routes = [ { path: '', component: DashboardComponent }, { path: ':id', component: ViewPanelComponent } ];

@NgModule({
	imports: [ RouterModule.forChild(routes) ],
	exports: [ RouterModule ]
})
export class DashboaradRoutingModule {}
