import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ReviewService } from '../services/review.service';
import * as ReviewActions from './review.actions';

@Injectable()
export class ReviewEffects {
  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.loadReviews),
      switchMap(({ snackId, page, size, sort, moderatedOnly }) =>
        this.reviewService.getReviews(snackId, page, size, sort, moderatedOnly).pipe(
          map(reviews => ReviewActions.loadReviewsSuccess({ reviews })),
          catchError(error => of(ReviewActions.loadReviewsFailure({ error: error.message })))
        )
      )
    )
  );

  loadReviewStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.loadReviewStats),
      switchMap(({ snackId }) =>
        this.reviewService.getReviewStats(snackId).pipe(
          map(stats => ReviewActions.loadReviewStatsSuccess({ stats })),
          catchError(error => of(ReviewActions.loadReviewStatsFailure({ error: error.message })))
        )
      )
    )
  );

  createReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.createReview),
      switchMap(({ reviewData, image }) =>
        this.reviewService.createReview(reviewData, image).pipe(
          map(review => ReviewActions.createReviewSuccess({ review })),
          catchError(error => of(ReviewActions.createReviewFailure({ error: error.message })))
        )
      )
    )
  );

  moderateReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReviewActions.moderateReview),
      switchMap(({ reviewId, approved }) =>
        this.reviewService.moderateReview(reviewId, approved).pipe(
          map(() => ReviewActions.moderateReviewSuccess({ reviewId, approved })),
          catchError(error => of(ReviewActions.moderateReviewFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private reviewService: ReviewService
  ) {}
} 