import { Component, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify-api.service';
import { SpotifyTrack } from '../../models/spotify.models';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html', // Usando template separado
  styleUrls: ['./timeline.component.scss'] // Usando estilos separados
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
