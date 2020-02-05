import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { MaterialModule } from './../material';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
	declarations: [ SidenavComponent, FooterComponent, HeaderComponent ],
	imports: [ BrowserAnimationsModule, CommonModule, MaterialModule, CoreRoutingModule ],
	exports: [ SidenavComponent, FooterComponent ]
})
export class CoreModule {}
