import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import * as AuthActions from './auth.actions';
import { User } from '../../models/user.model';

@Injectable()
export class AuthEffects {
  login$;
  loginSuccess$;
  register$;
  registerSuccess$;
  logout$;
  checkAuthStatus$;

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ username, password }) =>
          this.authService.login(username, password).pipe(
            map(response => {
              if (response.token) {
                const user: User = {
                  id: response.id,
                  username: response.username,
                  email: response.email,
                  role: response.role,
                  token: response.token,
                  type: response.type
                };
                this.tokenStorage.saveToken(response.token);
                this.tokenStorage.saveUser(user);
                return AuthActions.loginSuccess({ user });
              }
              throw new Error('No token received');
            }),
            catchError(error => of(AuthActions.loginFailure({ 
              error: error?.error?.message || error?.message || 'Login failed. Please check your credentials.' 
            })))
          )
        )
      )
    );

    this.loginSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
      { dispatch: false }
    );

    this.register$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.register),
        switchMap(({ username, email, password }) =>
          this.authService.register(username, email, password).pipe(
            map(() => AuthActions.registerSuccess()),
            catchError(error => of(AuthActions.registerFailure({ 
              error: error?.error?.message || error?.message || 'Registration failed' 
            })))
          )
        )
      )
    );

    this.registerSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
      { dispatch: false }
    );

    this.checkAuthStatus$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.checkAuthStatus),
        switchMap(() => {
          const user = this.tokenStorage.getUser();
          const token = this.tokenStorage.getToken();
          
          if (user && token) {
            return this.authService.validateToken(token).pipe(
              map(() => AuthActions.checkAuthStatusSuccess({ user })),
              catchError(error => {
                this.tokenStorage.signOut();
                return of(AuthActions.checkAuthStatusFailure({ 
                  error: 'Session expired. Please login again.' 
                }));
              })
            );
          }
          
          return of(AuthActions.checkAuthStatusFailure({ 
            error: 'No active session found.' 
          }));
        })
      )
    );

    this.logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.tokenStorage.signOut();
          this.router.navigate(['/auth/login']);
        })
      ),
      { dispatch: false }
    );
  }
} 