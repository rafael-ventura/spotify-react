import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-track-list',
  template: `
    <div class="tracks-list">
      <div *ngFor="let track of tracks; let i = index"
           class="track-item"
           [@fadeInUp]="i">
        <div class="rank">#{{i + 1}}</div>
        <img [src]="track.album.images[0].url" [alt]="track.name">
        <div class="info">
          <h3>{{track.name}}</h3>
          <p>{{track.artists[0].name}}</p>
          <p class="album">{{track.album.name}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tracks-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .track-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      gap: 1rem;
    }

    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--spotify-green);
      min-width: 3rem;
    }

    img {
      width: 60px;
      height: 60px;
      border-radius: 4px;
    }

    .info {
      h3 {
        margin: 0;
        color: white;
      }

      p {
        margin: 0.25rem 0;
        color: #b3b3b3;
      }

      .album {
        font-style: italic;
        font-size: 0.9rem;
      }
    }
  `],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms {{delay}}ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ], { params: { delay: 0 } })
    ])
  ]
})
export class TrackListComponent {
  @Input() tracks: any[] = [];
}
