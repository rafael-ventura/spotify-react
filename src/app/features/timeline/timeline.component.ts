import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { SpotifyTrack } from '../../models/spotify.models';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-timeline',
  template: `
    <div class="timeline-view">
      <div class="tracks-container" [@listAnimation]="tracks.length">
        <div *ngFor="let track of tracks; let i = index"
             class="track-item"
             [@itemAnimation]="'in'">
          <div class="track-rank">#{{i + 1}}</div>
          <div class="track-content">
            <img [src]="track.album.images[0].url" [alt]="track.name">
            <div class="track-info">
              <h3>{{track.name}}</h3>
              <p>{{track.artists[0].name}}</p>
              <p class="album-name">{{track.album.name}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-view {
      padding: 2rem;
      background: var(--surface-ground);
    }

    .tracks-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .track-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background: var(--surface-card);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;

      &:hover {
        transform: translateX(10px);
      }
    }

    .track-rank {
      font-size: 2rem;
      font-weight: bold;
      color: var(--spotify-green);
      margin-right: 1rem;
      min-width: 60px;
      text-align: center;
    }

    .track-content {
      display: flex;
      align-items: center;
      flex: 1;

      img {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        margin-right: 1rem;
      }
    }

    .track-info {
      h3 {
        margin: 0;
        color: var(--text-color);
      }

      p {
        margin: 0.5rem 0;
        color: var(--text-color-secondary);
      }

      .album-name {
        font-style: italic;
      }
    }
  `],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class TimelineComponent implements OnInit {
  tracks: SpotifyTrack[] = [];

  constructor(private spotifyApi: SpotifyApiService) {}

  ngOnInit() {
    this.loadTracks();
  }

  private loadTracks() {
    this.spotifyApi.getTopTracks('medium_term').subscribe(
      tracks => this.tracks = tracks
    );
  }
}
