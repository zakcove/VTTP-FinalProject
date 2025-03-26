import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ username: string; email: string; password: string }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success'
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const checkAuthStatus = createAction('[Auth] Check Auth Status');

export const checkAuthStatusSuccess = createAction(
  '[Auth] Check Auth Status Success',
  props<{ user: User }>()
);

export const checkAuthStatusFailure = createAction(
  '[Auth] Check Auth Status Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout'); 