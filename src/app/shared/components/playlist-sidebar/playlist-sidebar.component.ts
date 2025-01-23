import { Component, Input } from '@angular/core';
import { SpotifyTrack } from 'src/app/models/spotify.models';

@Component({
  selector: 'app-playlist-sidebar',
  template: `
    <div class="playlist-sidebar">
      <h2>Your Playlist</h2>
      <div class="playlist-tracks">
        <p-orderList [value]="tracks" [dragdrop]="true">
          <ng-template let-track pTemplate="item">
            <div class="track-item">
              <img [src]="track.album.images[0].url" [alt]="track.name">
              <div class="track-info">
                <h4>{{track.name}}</h4>
                <p>{{track.artists[0].name}}</p>
              </div>
            </div>
          </ng-template>
        </p-orderList>
      </div>
      <div class="playlist-actions">
        <p-button
          label="Download Image"
          icon="pi pi-download"
          (onClick)="downloadImage()">
        </p-button>
        <p-button
          label="Create Playlist"
          icon="pi pi-plus"
          (onClick)="createSpotifyPlaylist()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
    .playlist-sidebar {
      width: 300px;
      padding: 1rem;
      background: var(--surface-card);
      height: 100%;
    }
    .track-item {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      img {
        width: 50px;
        height: 50px;
        margin-right: 1rem;
      }
    }
    .playlist-actions {
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
    }
  `]
})
export class PlaylistSidebarComponent {
  @Input() tracks: SpotifyTrack[] = [];

  downloadImage() {
    // Implementar geração de imagem
  }

  createSpotifyPlaylist() {
    // Implementar criação de playlist
  }
}
