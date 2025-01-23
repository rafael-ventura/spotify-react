import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SpotifyTrack } from 'src/app/models/spotify.models';

@Component({
  selector: 'app-album-card',
  template: `
    <p-card class="album-card">
      <ng-template pTemplate="header">
        <img [src]="track.album.images[0].url" [alt]="track.name" class="album-image">
      </ng-template>
      <div class="album-info">
        <h3>{{track.name}}</h3>
        <p>{{track.artists[0].name}}</p>
        <p class="play-count">Played: {{playCount}} times</p>
      </div>
      <ng-template pTemplate="footer">
        <p-button
          icon="pi pi-plus"
          label="Add to Playlist"
          (onClick)="addToPlaylist.emit(track)">
        </p-button>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .album-card {
      margin: 1rem;
      max-width: 300px;
    }
    .album-image {
      width: 100%;
      height: auto;
    }
    .album-info {
      text-align: center;
    }
    .play-count {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class AlbumCardComponent {
  @Input() track!: SpotifyTrack;
  @Input() playCount: number = 0;
  @Output() addToPlaylist = new EventEmitter<SpotifyTrack>();
}
