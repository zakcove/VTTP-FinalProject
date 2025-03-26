import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.tokenStorage.getToken()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
} 