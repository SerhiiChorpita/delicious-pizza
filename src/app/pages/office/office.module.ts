import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeComponent } from './office.component';
import { SharedModule } from '../../shared/shared.module';
import { OfficeRoutingModule } from './office-routing.module';



@NgModule({
  declarations: [
    OfficeComponent
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SharedModule
  ]
})
export class OfficeModule { }
