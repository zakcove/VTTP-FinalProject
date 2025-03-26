import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ProfileComponent implements OnInit {
  user$ = this.store.select(selectCurrentUser);

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {}

  viewMyReviews(): void {
    this.router.navigate(['/reviews/my-reviews']);
  }

  createReview(): void {
    this.router.navigate(['/reviews/create']);
  }
} 