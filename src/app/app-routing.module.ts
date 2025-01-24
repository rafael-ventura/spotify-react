import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home.component';
import { TimelineComponent } from '@features/timeline/timeline.component';
import { CallbackComponent } from '@features/callback/callback.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'timeline',
    component: TimelineComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true },
  },
  { path: 'callback', component: CallbackComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // Certifique-se de que `useHash: false` está definido
  exports: [RouterModule],
})
export class AppRoutingModule {}
