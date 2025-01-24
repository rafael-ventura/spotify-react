import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss']
})
export class ActionButtonsComponent {
  @Input() selectedType: 'artists' | 'tracks' | null = null;
  @Input() playlistLoading: boolean = false;
  @Input() playlistCreated: boolean = false;
  @Input() onCreatePlaylist: () => void = () => {};
  @Input() onOpenPlaylist: () => void = () => {};
  @Input() onGenerateStory: () => void = () => {};
  @Input() onCreateRecommendedPlaylist: () => void = () => {};
}
