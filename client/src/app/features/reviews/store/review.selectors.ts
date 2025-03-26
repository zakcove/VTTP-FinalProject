import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReviewState } from './review.reducer';

export const selectReviewState = createFeatureSelector<ReviewState>('review');

export const selectReviews = createSelector(
  selectReviewState,
  (state) => state.reviews
);

export const selectReviewStats = createSelector(
  selectReviewState,
  (state) => state.stats
);

export const selectReviewLoading = createSelector(
  selectReviewState,
  (state) => state.loading
);

export const selectReviewError = createSelector(
  selectReviewState,
  (state) => state.error
);