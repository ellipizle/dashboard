import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './../material';
import { CoreRoutingModule } from './core-routing.module';
import { SatPopoverModule } from '@ncstate/sat-popover';
import { SharedModule } from '../shared/shared.module';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
@NgModule({
	declarations: [ SidenavComponent, FooterComponent, HeaderComponent ],
	imports: [
		SatPopoverModule,
		BrowserAnimationsModule,
		NgxMatDrpModule,
		CommonModule,
		SharedModule,
		CoreRoutingModule
	],
	exports: [ SidenavComponent, FooterComponent ],
	schemas: [ NO_ERRORS_SCHEMA ]
})
export class CoreModule {}
