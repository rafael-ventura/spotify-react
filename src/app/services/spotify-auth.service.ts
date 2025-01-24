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

    const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log('Generated Spotify login URL:', url); // Log para depuração
    window.location.href = url;
  }

  handleCallback(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const params = new URLSearchParams(window.location.search); // Captura os query parameters
        const accessToken = params.get('access_token');
        const expiresIn = params.get('expires_in');

        if (accessToken && expiresIn) {
          const expiresAt = Date.now() + parseInt(expiresIn, 10) * 1000;
          const tokenInfo = { token: accessToken, expiresAt };

          localStorage.setItem('spotify_token_info', JSON.stringify(tokenInfo));
          this.accessTokenSubject.next(accessToken);

          // Limpa a query string da URL
          window.history.replaceState({}, document.title, '/');
          resolve();
        } else {
          console.error('Callback parameters are invalid:', params.toString());
          reject('Invalid callback parameters');
        }
      } catch (error) {
        console.error('Error during callback handling:', error);
        reject(error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('spotify_token_info');
    this.accessTokenSubject.next(null);
    this.router.navigate(['/']);
  }
}
