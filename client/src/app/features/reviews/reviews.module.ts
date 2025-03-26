import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ReviewListComponent } from './components/review-list/review-list.component';
import { RatingStatsComponent } from './components/rating-stats/rating-stats.component';
import { reviewReducer } from './store/review.reducer';
import { ReviewEffects } from './store/review.effects';

@NgModule({
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    StoreModule.forFeature('review', reviewReducer),
    EffectsModule.forFeature([ReviewEffects]),
    ReviewFormComponent,
    ReviewListComponent,
    RatingStatsComponent
  ]
})
export class ReviewsModule { } 