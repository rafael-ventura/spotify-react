import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallbackComponent } from './callback.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    CallbackComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CallbackModule { }
