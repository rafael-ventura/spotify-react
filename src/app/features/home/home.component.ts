import { Component, OnInit } from '@angular/core';
import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  selectedType: 'artists' | 'tracks' | null = null;
  selectedTimeRange: string | null = null;
  loading = false;
  showContent = false;
  items: any[] = [];
  isStepsCompleted = false;
  playlistLoading = false;
  playlistCreated = false;
  playlistUrl: string | null = null;
  itemsPerPage = 5;
  currentPage = 1;
  itemsPerPageOptions = [
    { label: '5 items', value: 5 },
    { label: '10 items', value: 10 },
    { label: '25 items', value: 25 },
    { label: '50 items', value: 50 }
  ];

  timeRanges = [
    { label: 'Last Month', value: 'short_term' },
    { label: 'Last 6 Months', value: 'medium_term' },
    { label: 'All Time', value: 'long_term' }
  ];

  constructor(
    private spotifyAuth: SpotifyAuthService,
    private spotifyApi: SpotifyApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.spotifyAuth.accessToken$.subscribe(token => {
      this.isLoggedIn = !!token;
      if (this.isLoggedIn) {
        this.loadUserProfile();
      }
    });
  }

  onLogin(): void {
    this.spotifyAuth.login();
  }

  onTypeSelect(event: { value: 'artists' | 'tracks' }): void {
    this.selectedType = event.value;
    this.showContent = true;
  }

  onTimeRangeSelect(event: { value: string }): void {
    this.selectedTimeRange = event.value;
    this.loading = true;
    this.items = [];
    this.isStepsCompleted = true;

    if (this.selectedType === 'tracks') {
      this.spotifyApi.getTopTracks(event.value).subscribe({
        next: (items: any[]) => {
          this.items = items;
          this.loading = false;
        },
        error: this.handleError.bind(this)
      });
    } else if (this.selectedType === 'artists') {
      this.spotifyApi.getTopArtists(event.value).subscribe({
        next: (items: any[]) => {
          this.items = items;
          this.loading = false;
        },
        error: this.handleError.bind(this)
      });
    }
  }

  private handleError(error: any): void {
    console.error('Error loading content:', error);
    this.loading = false;
    if (error.status === 401) {
      this.spotifyAuth.logout();
    }
  }

  private loadUserProfile(): void {
    this.spotifyApi.getUserProfile().subscribe({
      next: (profile) => {
        console.log('User profile loaded:', profile);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.spotifyAuth.logout();
      }
    });
  }

  resetSteps(): void {
    this.selectedType = null;
    this.selectedTimeRange = null;
    this.showContent = false;
    this.items = [];
    this.isStepsCompleted = false;
    this.playlistCreated = false;
    this.playlistUrl = null;
  }

  async createPlaylist(): Promise<void> {
    this.playlistLoading = true;
    try {
      const profile = await this.spotifyApi.getUserProfile().toPromise();
      const playlist = await this.spotifyApi.createPlaylist(
        profile.id,
        `My Top ${this.selectedType} - ${this.getTimeRangeLabel(this.selectedTimeRange!)}`
      ).toPromise();

      if (this.selectedType === 'tracks') {
        await this.spotifyApi.addTracksToPlaylist(
          playlist.id,
          this.paginatedItems.map(track => track.uri)
        ).toPromise();
      } else {
        const allTracks = [];
        for (const artist of this.paginatedItems) {
          const topTracks = await this.spotifyApi.getArtistTopTracks(artist.id).toPromise();
          allTracks.push(...topTracks.slice(0, 5));
        }

        await this.spotifyApi.addTracksToPlaylist(
          playlist.id,
          allTracks.map(track => track.uri)
        ).toPromise();
      }

      this.playlistCreated = true;
      this.playlistUrl = playlist.external_urls.spotify;
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      this.playlistLoading = false;
    }
  }

  openPlaylist(): void {
    if (this.playlistUrl) {
      window.open(this.playlistUrl, '_blank');
    }
  }

  generateStory(): void {
    // Será implementado posteriormente
  }

  getTimeRangeLabel(value: string): string {
    return this.timeRanges.find(range => range.value === value)?.label || '';
  }

  get paginatedItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.items.slice(start, end);
  }

  async createRecommendedPlaylist(): Promise<void> {
    this.playlistLoading = true;
    try {
      const profile = await this.spotifyApi.getUserProfile().toPromise();
      let seedGenres: string[] = [];
      let seedTracks: string[] = [];
      let seedArtists: string[] = [];

      if (this.selectedType === 'artists') {
        // Get unique genres from selected artists
        seedGenres = this.paginatedItems.flatMap(artist => artist.genres)
          .filter((genre, index, self) => self.indexOf(genre) === index)
          .slice(0, 2);

        // Get some artist IDs as seeds
        seedArtists = this.paginatedItems
          .slice(0, 2)
          .map(artist => artist.id);
      } else {
        // For tracks, use both track and artist seeds
        seedTracks = this.paginatedItems
          .slice(0, 2)
          .map(track => track.id);

        // Get artist IDs from the tracks
        const artistIds = [...new Set(this.paginatedItems.flatMap(track =>
          track.artists.map((artist: any) => artist.id)
        ))];

        seedArtists = artistIds.slice(0, 2);

        // Get genres from the artists
        const artists = await Promise.all(
          artistIds.slice(0, 3).map(id =>
            this.spotifyApi.getArtist(id).toPromise()
          )
        );

        seedGenres = artists.flatMap(artist => artist.genres)
          .filter((genre, index, self) => self.indexOf(genre) === index)
          .slice(0, 2);
      }

      // Create playlist
      const playlist = await this.spotifyApi.createPlaylist(
        profile.id,
        `Recommended based on your ${this.selectedType}`
      ).toPromise();

      // Get recommendations using all seed types
      const recommendations = await this.spotifyApi.getRecommendations({
        seed_genres: seedGenres,
        seed_tracks: seedTracks,
        seed_artists: seedArtists,
        limit: Math.min(this.paginatedItems.length * 2, 30), // Dynamic limit based on selection
        min_popularity: 50
      }).toPromise();

      // Add tracks to playlist
      await this.spotifyApi.addTracksToPlaylist(
        playlist.id,
        recommendations.tracks.map((track: any) => track.uri)
      ).toPromise();

      this.playlistCreated = true;
      this.playlistUrl = playlist.external_urls.spotify;
    } catch (error) {
      console.error('Error creating recommended playlist:', error);
    } finally {
      this.playlistLoading = false;
    }
  }

  onItemsPerPageChange(event: any): void {
    this.currentPage = 1; // Reset para primeira página quando mudar o número de items
    this.itemsPerPage = event.value;
  }
}

