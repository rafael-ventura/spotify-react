import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

// PrimeNG Modules
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';

@NgModule({
  declarations: [
    HomeComponent,
    ActionButtonsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    HomeRoutingModule,
    ProgressSpinnerModule,
    DropdownModule,
    ButtonModule,
    TooltipModule
  ]
})
export class HomeModule { }
