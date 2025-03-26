import { createAction, props } from '@ngrx/store';
import { Snack, CreateSnackDto, UpdateSnackDto, SnackResponse } from '../models/snack.model';

// Load Snacks
export const loadSnacks = createAction(
  '[Snack] Load Snacks',
  props<{ page: number; size: number; category?: string }>()
);

export const loadSnacksSuccess = createAction(
  '[Snack] Load Snacks Success',
  props<{ response: SnackResponse }>()
);

export const loadSnacksFailure = createAction(
  '[Snack] Load Snacks Failure',
  props<{ error: string }>()
);

// Load Single Snack
export const loadSnack = createAction(
  '[Snack] Load Snack',
  props<{ id: number }>()
);

export const loadSnackSuccess = createAction(
  '[Snack] Load Snack Success',
  props<{ snack: Snack }>()
);

export const loadSnackFailure = createAction(
  '[Snack] Load Snack Failure',
  props<{ error: string }>()
);

// Create Snack
export const createSnack = createAction(
  '[Snack] Create Snack',
  props<{ snack: CreateSnackDto }>()
);

export const createSnackSuccess = createAction(
  '[Snack] Create Snack Success',
  props<{ snack: Snack }>()
);

export const createSnackFailure = createAction(
  '[Snack] Create Snack Failure',
  props<{ error: string }>()
);

// Update Snack
export const updateSnack = createAction(
  '[Snack] Update Snack',
  props<{ id: number; snack: UpdateSnackDto }>()
);

export const updateSnackSuccess = createAction(
  '[Snack] Update Snack Success',
  props<{ snack: Snack }>()
);

export const updateSnackFailure = createAction(
  '[Snack] Update Snack Failure',
  props<{ error: string }>()
);

// Delete Snack
export const deleteSnack = createAction(
  '[Snack] Delete Snack',
  props<{ id: number }>()
);

export const deleteSnackSuccess = createAction(
  '[Snack] Delete Snack Success',
  props<{ id: number }>()
);

export const deleteSnackFailure = createAction(
  '[Snack] Delete Snack Failure',
  props<{ error: string }>()
);

// Search Snacks
export const searchSnacks = createAction(
  '[Snack] Search Snacks',
  props<{ query: string; page: number; size: number }>()
);

export const searchSnacksSuccess = createAction(
  '[Snack] Search Snacks Success',
  props<{ response: SnackResponse }>()
);

export const searchSnacksFailure = createAction(
  '[Snack] Search Snacks Failure',
  props<{ error: string }>()
); 