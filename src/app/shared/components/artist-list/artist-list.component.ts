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
          <p>{{artist.genres[0]}}</p>
          <p class="followers">{{artist.followers.total | number}} followers</p>
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
      border-radius: 50%;
      object-fit: cover;
    }

    .info {
      h3 {
        margin: 0;
        color: white;
      }

      p {
        margin: 0.25rem 0;
        color: #b3b3b3;
        text-transform: capitalize;
      }

      .followers {
        font-size: 0.9rem;
        opacity: 0.8;
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
}
