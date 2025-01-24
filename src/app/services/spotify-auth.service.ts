import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

interface TokenInfo {
  token: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkSavedToken();
  }

  private checkSavedToken(): void {
    const savedToken = localStorage.getItem('spotify_token_info');
    if (savedToken) {
      const tokenInfo: TokenInfo = JSON.parse(savedToken);
      const now = Date.now();

      if (now < tokenInfo.expiresAt) {
        this.accessTokenSubject.next(tokenInfo.token);
      } else {
        localStorage.removeItem('spotify_token_info');
      }
    }
  }

  get accessToken$(): Observable<string | null> {
    return this.accessTokenSubject.asObservable();
  }

  login(): void {
    const params = new URLSearchParams({
      client_id: environment.spotify.clientId,
      response_type: 'token',
      redirect_uri: environment.spotify.redirectUri,
      scope: environment.spotify.scopes,
      show_dialog: 'true',
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }


  handleCallback(hash: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const params = new URLSearchParams(hash.substring(1)); // Remove o '#'
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if (accessToken && expiresIn) {
          const expiresAt = Date.now() + parseInt(expiresIn, 10) * 1000;
          const tokenInfo = { token: accessToken, expiresAt };

          localStorage.setItem('spotify_token_info', JSON.stringify(tokenInfo));
          this.accessTokenSubject.next(accessToken);
          resolve(); // Resolve a Promise quando tudo é bem-sucedido
        } else {
          reject('Invalid callback parameters'); // Rejeita se os parâmetros não forem encontrados
        }
      } catch (error) {
        reject(error); // Rejeita em caso de erro
      }
    });
  }




  logout(): void {
    localStorage.removeItem('spotify_token_info');
    this.accessTokenSubject.next(null);
    this.router.navigate(['/']);
  }
}
