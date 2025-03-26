import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Snack } from '../../models/snack.model';
import * as SnackActions from '../../store/snack.actions';
import { selectSelectedSnack, selectSnackLoading, selectSnackError } from '../../store/snack.selectors';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { ReviewListComponent } from '../../../reviews/components/review-list/review-list.component';
import { RatingStatsComponent } from '../../../reviews/components/rating-stats/rating-stats.component';

@Component({
  selector: 'app-snack-detail',
  templateUrl: './snack-detail.component.html',
  styleUrls: ['./snack-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    ReviewListComponent,
    RatingStatsComponent
  ]
})
export class SnackDetailComponent implements OnInit {
  snack$: Observable<Snack | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAdmin$: Observable<boolean | undefined>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.snack$ = this.store.select(selectSelectedSnack);
    this.loading$ = this.store.select(selectSnackLoading);
    this.error$ = this.store.select(selectSnackError);
    this.isAdmin$ = this.store.select(selectCurrentUser).pipe(
      map(user => {
        if (!user) return undefined;
        return user.role === 'ADMIN';
      })
    );
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(SnackActions.loadSnack({ id: +id }));
    }
  }

  onDelete(id: number): void {
    if (id && confirm('Are you sure you want to delete this snack?')) {
      this.store.dispatch(SnackActions.deleteSnack({ id }));
      this.router.navigate(['/snacks']);
    }
  }
} 