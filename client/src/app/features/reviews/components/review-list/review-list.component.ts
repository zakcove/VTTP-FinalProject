import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Review, ReviewResponse } from '../../models/review.model';
import * as ReviewActions from '../../store/review.actions';
import { selectReviews, selectReviewLoading, selectReviewError } from '../../store/review.selectors';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ]
})
export class ReviewListComponent implements OnInit {
  @Input() snackId!: number;
  @Input() set isAdmin(value: boolean | null | undefined) {
    this._isAdmin = value ?? false;
  }
  get isAdmin(): boolean {
    return this._isAdmin;
  }
  private _isAdmin = false;

  reviews$: Observable<ReviewResponse | null> = this.store.select(selectReviews);
  loading$ = this.store.select(selectReviewLoading);
  error$ = this.store.select(selectReviewError);

  sortOptions = [
    { value: 'newest', label: 'Most Recent' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' }
  ];

  currentSort = 'newest';
  currentPage = 0;
  pageSize = 10;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.store.dispatch(ReviewActions.loadReviews({
      snackId: this.snackId,
      page: this.currentPage,
      size: this.pageSize,
      sort: this.currentSort,
      moderatedOnly: !this.isAdmin
    }));
  }

  onSortChange(sort: string): void {
    this.currentSort = sort;
    this.currentPage = 0;
    this.loadReviews();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadReviews();
  }

  onModerateReview(reviewId: number, approved: boolean): void {
    this.store.dispatch(ReviewActions.moderateReview({ reviewId, approved }));
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
} 