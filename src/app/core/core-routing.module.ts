import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/components/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
const routes: Routes = [
	{
		path: '',
		component: SidenavComponent,
		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			},
			{
				path: 'dashboard',
				loadChildren: '../dashboard/dashboard.module#DashboardModule'
			}
		]
	}
	// { path: 'dashboard', component: DashboardComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class CoreRoutingModule {}
