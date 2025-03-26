import { createReducer, on } from '@ngrx/store';
import { initialSnackState } from './snack.state';
import * as SnackActions from './snack.actions';

export const snackReducer = createReducer(
  initialSnackState,

  // Load Snacks
  on(SnackActions.loadSnacks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.loadSnacksSuccess, (state, { response }) => ({
    ...state,
    snacks: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    currentPage: response.number,
    pageSize: response.size,
    loading: false,
    error: null
  })),

  on(SnackActions.loadSnacksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Single Snack
  on(SnackActions.loadSnack, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.loadSnackSuccess, (state, { snack }) => ({
    ...state,
    selectedSnack: snack,
    loading: false,
    error: null
  })),

  on(SnackActions.loadSnackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Snack
  on(SnackActions.createSnack, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.createSnackSuccess, (state, { snack }) => ({
    ...state,
    snacks: [snack, ...state.snacks],
    loading: false,
    error: null
  })),

  on(SnackActions.createSnackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Snack
  on(SnackActions.updateSnack, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.updateSnackSuccess, (state, { snack }) => ({
    ...state,
    snacks: state.snacks.map(s => s.id === snack.id ? snack : s),
    selectedSnack: snack,
    loading: false,
    error: null
  })),

  on(SnackActions.updateSnackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Delete Snack
  on(SnackActions.deleteSnack, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.deleteSnackSuccess, (state, { id }) => ({
    ...state,
    snacks: state.snacks.filter(snack => snack.id !== id),
    loading: false,
    error: null
  })),

  on(SnackActions.deleteSnackFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Search Snacks
  on(SnackActions.searchSnacks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(SnackActions.searchSnacksSuccess, (state, { response }) => ({
    ...state,
    snacks: response.content,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
    currentPage: response.number,
    pageSize: response.size,
    loading: false,
    error: null
  })),

  on(SnackActions.searchSnacksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
); 