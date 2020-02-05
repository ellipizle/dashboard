import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material';
import { NgxEchartsModule } from 'ngx-echarts';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
	declarations: [ ConfirmDialogComponent ],
	imports: [ CommonModule, FlexLayoutModule, DragDropModule, MaterialModule ],
	exports: [
		CommonModule,
		FlexLayoutModule,
		DragDropModule,
		MaterialModule,
		NgxEchartsModule,
		ReactiveFormsModule,
		FormsModule
	],
	entryComponents: [ ConfirmDialogComponent ]
})
export class SharedModule {}
