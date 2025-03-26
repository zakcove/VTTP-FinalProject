import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false
};