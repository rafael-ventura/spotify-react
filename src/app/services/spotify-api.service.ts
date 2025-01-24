import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      headers: this.getHeaders(),
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

  getTrackAudioFeatures(trackId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/audio-features/${trackId}`, {
      headers: this.getHeaders()
    });
  }

  getRecommendations(params: {
    seed_artists?: string[];
    seed_tracks?: string[];
    seed_genres?: string[];
    limit?: number;
    target_popularity?: number;
    min_popularity?: number;
  }): Observable<any> {
    const queryParams = new HttpParams({
      fromObject: {
        limit: params.limit?.toString() || '20',
        ...params.seed_artists ? { seed_artists: params.seed_artists.join(',') } : {},
        ...params.seed_tracks ? { seed_tracks: params.seed_tracks.join(',') } : {},
        ...params.seed_genres ? { seed_genres: params.seed_genres.join(',') } : {},
        ...params.target_popularity ? { target_popularity: params.target_popularity.toString() } : {},
        ...params.min_popularity ? { min_popularity: params.min_popularity.toString() } : {}
      }
    });

    return this.http.get(`${this.baseUrl}/recommendations`, {
      headers: this.getHeaders(),
      params: queryParams
    });
  }

  getArtistTopTracks(artistId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/${artistId}/top-tracks`, {
      headers: this.getHeaders(),
      params: { market: 'from_token' }
    }).pipe(
      map((response: any) => response.tracks)
    );
  }

  getArtist(artistId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/artists/${artistId}`, {
      headers: this.getHeaders()
    });
  }

  getUniqueGenres(artists: any[]): string[] {
    const allGenres = artists.reduce((acc: string[], artist) => {
      return [...acc, ...(artist.genres || [])];
    }, [] as string[]);
    return Array.from(new Set(allGenres));
  }
}
