import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SnackState } from './snack.state';

export const selectSnackState = createFeatureSelector<SnackState>('snacks');

export const selectAllSnacks = createSelector(
  selectSnackState,
  (state: SnackState) => state.snacks
);

export const selectSelectedSnack = createSelector(
  selectSnackState,
  (state: SnackState) => state.selectedSnack
);

export const selectSnackLoading = createSelector(
  selectSnackState,
  (state: SnackState) => state.loading
);

export const selectSnackError = createSelector(
  selectSnackState,
  (state: SnackState) => state.error
);

export const selectSnackPagination = createSelector(
  selectSnackState,
  (state: SnackState) => ({
    totalElements: state.totalElements,
    totalPages: state.totalPages,
    currentPage: state.currentPage,
    pageSize: state.pageSize
  })
); 