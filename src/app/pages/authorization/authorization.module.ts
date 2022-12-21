import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AuthorizationComponent } from './authorization.component';
import { AuthorizationRoutingModule } from './authorization-routing.module';

@NgModule({
  declarations: [
    AuthorizationComponent
  ],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    SharedModule
  ]
})
export class AuthorizationModule { }
