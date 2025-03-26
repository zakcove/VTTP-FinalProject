import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SnackService } from '../services/snack.service';
import * as SnackActions from './snack.actions';
import { Snack, SnackResponse } from '../models/snack.model';

@Injectable()
export class SnackEffects {
  private actions$ = inject(Actions);
  private snackService = inject(SnackService);

  loadSnacks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.loadSnacks),
      switchMap(({ page, size, category }) =>
        this.snackService.getSnacks(page, size, category).pipe(
          map((response: SnackResponse) => SnackActions.loadSnacksSuccess({ response })),
          catchError(error => of(SnackActions.loadSnacksFailure({ error: error.message })))
        )
      )
    )
  );

  loadSnack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.loadSnack),
      switchMap(({ id }) =>
        this.snackService.getSnackById(id).pipe(
          map((snack: Snack) => SnackActions.loadSnackSuccess({ snack })),
          catchError(error => of(SnackActions.loadSnackFailure({ error: error.message })))
        )
      )
    )
  );

  createSnack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.createSnack),
      switchMap(({ snack }) =>
        this.snackService.createSnack(snack).pipe(
          map((createdSnack: Snack) => SnackActions.createSnackSuccess({ snack: createdSnack })),
          catchError(error => of(SnackActions.createSnackFailure({ error: error.message })))
        )
      )
    )
  );

  updateSnack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.updateSnack),
      switchMap(({ id, snack }) =>
        this.snackService.updateSnack(id, snack).pipe(
          map((updatedSnack: Snack) => SnackActions.updateSnackSuccess({ snack: updatedSnack })),
          catchError(error => of(SnackActions.updateSnackFailure({ error: error.message })))
        )
      )
    )
  );

  deleteSnack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.deleteSnack),
      switchMap(({ id }) =>
        this.snackService.deleteSnack(id).pipe(
          map(() => SnackActions.deleteSnackSuccess({ id })),
          catchError(error => of(SnackActions.deleteSnackFailure({ error: error.message })))
        )
      )
    )
  );

  searchSnacks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SnackActions.searchSnacks),
      switchMap(({ query, page, size }) =>
        this.snackService.searchSnacks(query, page, size).pipe(
          map((response: SnackResponse) => SnackActions.searchSnacksSuccess({ response })),
          catchError(error => of(SnackActions.searchSnacksFailure({ error: error.message })))
        )
      )
    )
  );
} 