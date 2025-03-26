import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectCurrentUser } from '../store/auth/auth.selectors';

export const adminGuard = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectCurrentUser).pipe(
    take(1),
    map(user => {
      if (user?.role === 'ADMIN') {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
}; 