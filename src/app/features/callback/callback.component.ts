import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="callback-container">
      <p-progressSpinner></p-progressSpinner>
      <h2>Connecting to Spotify...</h2>
    </div>
  `,
  styles: [`
    .callback-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: linear-gradient(135deg, var(--spotify-black) 0%, #2d1b4e 100%);
      color: white;
    }
  `]
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private spotifyAuth: SpotifyAuthService
  ) {}

  ngOnInit() {
    const hash = window.location.hash;
    if (hash) {
      this.spotifyAuth.handleCallback(hash);
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
