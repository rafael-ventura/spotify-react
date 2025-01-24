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


  handleCallback(hash: string): void {
    try {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');

      if (accessToken && expiresIn) {
        const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
        const tokenInfo: TokenInfo = {
          token: accessToken,
          expiresAt,
        };

        localStorage.setItem('spotify_token_info', JSON.stringify(tokenInfo));
        this.accessTokenSubject.next(accessToken);
      } else {
        throw new Error('Invalid Spotify callback parameters');
      }
    } catch (error) {
      console.error('Error handling Spotify callback:', error);
      this.logout(); // Limpa estado se algo der errado
    }
  }



  logout(): void {
    localStorage.removeItem('spotify_token_info');
    this.accessTokenSubject.next(null);
    this.router.navigate(['/']);
  }
}
