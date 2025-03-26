import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ReviewStats } from '../../models/review.model';
import * as ReviewActions from '../../store/review.actions';
import { selectReviewStats } from '../../store/review.selectors';

@Component({
  selector: 'app-rating-stats',
  templateUrl: './rating-stats.component.html',
  styleUrls: ['./rating-stats.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class RatingStatsComponent implements OnInit {
  @Input() snackId!: number;

  stats$: Observable<ReviewStats | null> = this.store.select(selectReviewStats);
  ratingLevels = [5, 4, 3, 2, 1];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.store.dispatch(ReviewActions.loadReviewStats({ snackId: this.snackId }));
  }

  getPercentage(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  roundRating(rating: number): number {
    return Math.round(rating);
  }
} 