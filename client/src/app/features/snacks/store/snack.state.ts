import { Snack } from '../models/snack.model';

export interface SnackState {
  snacks: Snack[];
  selectedSnack: Snack | null;
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const initialSnackState: SnackState = {
  snacks: [],
  selectedSnack: null,
  loading: false,
  error: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10
}; 