import { createAction, props } from '@ngrx/store';
import { Review, ReviewResponse, ReviewStats } from '../models/review.model';
import { CreateReviewRequest } from '../models/create-review-request.model';

// Load Reviews
export const loadReviews = createAction(
  '[Review] Load Reviews',
  props<{ snackId: number; page: number; size: number; sort: string; moderatedOnly: boolean }>()
);

export const loadReviewsSuccess = createAction(
  '[Review] Load Reviews Success',
  props<{ reviews: ReviewResponse }>()
);

export const loadReviewsFailure = createAction(
  '[Review] Load Reviews Failure',
  props<{ error: string }>()
);

// Load Review Stats
export const loadReviewStats = createAction(
  '[Review] Load Review Stats',
  props<{ snackId: number }>()
);

export const loadReviewStatsSuccess = createAction(
  '[Review] Load Review Stats Success',
  props<{ stats: ReviewStats }>()
);

export const loadReviewStatsFailure = createAction(
  '[Review] Load Review Stats Failure',
  props<{ error: string }>()
);

// Create Review
export const createReview = createAction(
  '[Review] Create Review',
  props<{ reviewData: CreateReviewRequest; image?: File }>()
);

export const createReviewSuccess = createAction(
  '[Review] Create Review Success',
  props<{ review: Review }>()
);

export const createReviewFailure = createAction(
  '[Review] Create Review Failure',
  props<{ error: string }>()
);

// Moderate Review
export const moderateReview = createAction(
  '[Review] Moderate Review',
  props<{ reviewId: number; approved: boolean }>()
);

export const moderateReviewSuccess = createAction(
  '[Review] Moderate Review Success',
  props<{ reviewId: number; approved: boolean }>()
);

export const moderateReviewFailure = createAction(
  '[Review] Moderate Review Failure',
  props<{ error: string }>()
); 