import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyAuthService } from './spotify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private auth: SpotifyAuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('spotify_token_info');
    if (token) {
      const tokenInfo = JSON.parse(token);
      return new HttpHeaders({
        'Authorization': `Bearer ${tokenInfo.token}`
      });
    }
    return new HttpHeaders();
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`, {
      headers: this.getHeaders()
    });
  }

  getTopTracks(timeRange: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/me/top/tracks`, {
      headers: this.getHeaders(),
      params: {
        limit: '50',
        time_range: timeRange
      }
    }).pipe(
      map((response: any) => response.items)
    );
  }

  getTopArtists(timeRange: string): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/me/top/artists`, {
      params: {
        limit: '50',
        time_range: timeRange
      }
    }).pipe(
      map((response: any) => response.items)
    );
  }

  createPlaylist(userId: string, name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/${userId}/playlists`, {
      name,
      public: false,
      description: 'Created by Spotify Timeline Generator'
    }, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error creating playlist:', error);
        return throwError(() => error);
      })
    );
  }

  addTracksToPlaylist(playlistId: string, trackUris: string[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      { headers: this.getHeaders() }
    );
  }
}
