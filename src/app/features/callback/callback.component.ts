import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html', // Usando template separado
  styleUrls: ['./callback.component.scss'] // Usando estilos separados
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
