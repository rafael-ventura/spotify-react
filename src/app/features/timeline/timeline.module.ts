import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { SharedModule } from '@shared/shared.module';
import { TimelineRoutingModule } from './timeline-routing.module';
@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimelineRoutingModule
  ]
})
export class TimelineModule { }
