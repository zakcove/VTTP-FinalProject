import { createReducer, on } from '@ngrx/store';
import { Review, ReviewResponse, ReviewStats } from '../models/review.model';
import * as ReviewActions from './review.actions';

export interface ReviewState {
  reviews: ReviewResponse | null;
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ReviewState = {
  reviews: null,
  stats: null,
  loading: false,
  error: null
};

export const reviewReducer = createReducer(
  initialState,

  // Load Reviews
  on(ReviewActions.loadReviews, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ReviewActions.loadReviewsSuccess, (state, { reviews }) => ({
    ...state,
    reviews,
    loading: false,
    error: null
  })),

  on(ReviewActions.loadReviewsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Review Stats
  on(ReviewActions.loadReviewStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ReviewActions.loadReviewStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
    error: null
  })),

  on(ReviewActions.loadReviewStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Review
  on(ReviewActions.createReview, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ReviewActions.createReviewSuccess, (state, { review }) => {
    if (!state.reviews) return state;

    const updatedContent = [review, ...state.reviews.content];
    const updatedReviews: ReviewResponse = {
      ...state.reviews,
      content: updatedContent,
      totalElements: state.reviews.totalElements + 1
    };

    return {
      ...state,
      reviews: updatedReviews,
      loading: false,
      error: null
    };
  }),

  on(ReviewActions.createReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Moderate Review
  on(ReviewActions.moderateReview, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ReviewActions.moderateReviewSuccess, (state, { reviewId, approved }) => {
    if (!state.reviews) return state;

    const updatedContent = approved
      ? state.reviews.content.map(review =>
          review.id === reviewId ? { ...review, isModerated: true } : review
        )
      : state.reviews.content.filter(review => review.id !== reviewId);

    const updatedReviews: ReviewResponse = {
      ...state.reviews,
      content: updatedContent,
      totalElements: approved ? state.reviews.totalElements : state.reviews.totalElements - 1
    };

    return {
      ...state,
      reviews: updatedReviews,
      loading: false,
      error: null
    };
  }),

  on(ReviewActions.moderateReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
); 