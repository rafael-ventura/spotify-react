import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private spotifyAuth: SpotifyAuthService
  ) {}

  ngOnInit() {
    const hash = window.location.hash;
    if (hash) {
      this.spotifyAuth.handleCallback(hash)
        .then(() => {
          this.router.navigate(['/']);
        })
        .catch((err: Error) => {
          console.error('Erro ao processar o callback do Spotify:', err.message);
          this.router.navigate(['/error']);
        });
    } else {
      console.warn('Nenhum hash encontrado na URL.');
      this.router.navigate(['/error']);
    }
  }
}
