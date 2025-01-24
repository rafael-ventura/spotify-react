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
      this.spotifyAuth.handleCallback(hash).then(() => {
        this.router.navigate(['/']);
      }).catch(err => {
        console.error('Erro ao processar o callback do Spotify:', err);
        // Opção: redirecionar para uma página de erro específica
        this.router.navigate(['/error']);
      });
    } else {
      console.warn('Nenhum hash encontrado na URL.');
      this.router.navigate(['/error']);
    }
  }
}
