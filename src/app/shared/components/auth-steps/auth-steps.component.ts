import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth-steps',
  templateUrl: './auth-steps.component.html',
  styleUrls: ['./auth-steps.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AuthStepsComponent {
  @Input() isLoggedIn = false;
  @Input() selectedType: 'albums' | 'tracks' | null = null;
  @Input() selectedTimeRange: string | null = null;
  @Input() loading = false;

  @Output() loginClick = new EventEmitter<void>();
  @Output() typeSelect = new EventEmitter<'albums' | 'tracks'>();
  @Output() timeRangeSelect = new EventEmitter<string>();

  timeRanges = [
    { label: 'Last Month', value: 'short_term' },
    { label: 'Last 6 Months', value: 'medium_term' },
    { label: 'All Time', value: 'long_term' }
  ];

  getTimeRangeLabel(value: string): string {
    return this.timeRanges.find(range => range.value === value)?.label || '';
  }
}
