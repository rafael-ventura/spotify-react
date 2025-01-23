import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-artist-list',
  template: `
    <div class="artists-list">
      <div *ngFor="let artist of artists; let i = index"
           class="artist-item"
           [@fadeInUp]="i">
        <div class="rank">#{{i + 1}}</div>
        <img [src]="artist.images[0]?.url" [alt]="artist.name">
        <div class="info">
          <h3>{{artist.name}}</h3>
          <div class="genres">
            <span *ngFor="let genre of artist.genres.slice(0, 3); let last = last">
              {{genre}}{{!last ? ', ' : ''}}
            </span>
          </div>
          <div class="details">
            <span class="popularity" [title]="'Popularity: ' + artist.popularity + '%'">
              <i class="pi pi-chart-bar"></i>
              {{artist.popularity}}%
            </span>
            <span class="followers">
              <i class="pi pi-users"></i>
              {{formatFollowers(artist.followers.total)}}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .artists-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .artist-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      gap: 1rem;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateX(10px);
        background: rgba(255, 255, 255, 0.08);
      }
    }

    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--spotify-green);
      min-width: 3rem;
    }

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
    }

    .info {
      flex: 1;

      h3 {
        margin: 0;
        color: white;
        font-size: 1.2rem;
      }

      .genres {
        color: #b3b3b3;
        margin: 0.25rem 0;
        font-style: italic;
      }

      .details {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #b3b3b3;

        span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        i {
          color: var(--spotify-green);
        }
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
export class ArtistListComponent {
  @Input() artists: any[] = [];

  formatFollowers(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
