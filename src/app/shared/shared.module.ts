import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';

import { AuthStepsComponent } from './components/auth-steps/auth-steps.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { ArtistListComponent } from './components/artist-list/artist-list.component';

@NgModule({
  declarations: [
    AuthStepsComponent,
    TrackListComponent,
    ArtistListComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    RippleModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule
  ],
  exports: [
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    RippleModule,
    ToastModule,
    ConfirmDialogModule,
    DropdownModule,
    AuthStepsComponent,
    TrackListComponent,
    ArtistListComponent
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class SharedModule { }
