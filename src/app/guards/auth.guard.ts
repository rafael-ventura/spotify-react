import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private spotifyAuth: SpotifyAuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.spotifyAuth.accessToken$.pipe(
      map(token => {
        if (!token) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}
