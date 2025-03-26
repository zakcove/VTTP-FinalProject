import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Snack, SnackCategory } from '../../models/snack.model';
import * as SnackActions from '../../store/snack.actions';
import { selectAllSnacks, selectSnackLoading, selectSnackError, selectSnackPagination } from '../../store/snack.selectors';

@Component({
  selector: 'app-snack-list',
  templateUrl: './snack-list.component.html',
  styleUrls: ['./snack-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ]
})
export class SnackListComponent implements OnInit {
  snacks$: Observable<Snack[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  pagination$: Observable<{
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>;

  selectedCategory: string = '';
  searchQuery: string = '';
  categories: SnackCategory[] = ['CHIPS', 'CANDY', 'CHOCOLATE', 'NUTS', 'BEVERAGES', 'OTHER'];

  constructor(private store: Store) {
    this.snacks$ = this.store.select(selectAllSnacks);
    this.loading$ = this.store.select(selectSnackLoading);
    this.error$ = this.store.select(selectSnackError);
    this.pagination$ = this.store.select(selectSnackPagination);
  }

  ngOnInit(): void {
    this.loadSnacks();
  }

  loadSnacks(page: number = 0, size: number = 10): void {
    if (this.searchQuery) {
      this.store.dispatch(SnackActions.searchSnacks({ 
        query: this.searchQuery,
        page,
        size 
      }));
    } else {
      this.store.dispatch(SnackActions.loadSnacks({ 
        page,
        size,
        category: this.selectedCategory || undefined
      }));
    }
  }

  onPageChange(event: PageEvent): void {
    this.loadSnacks(event.pageIndex, event.pageSize);
  }

  onCategoryChange(): void {
    this.loadSnacks();
  }

  onSearch(): void {
    this.loadSnacks();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadSnacks();
  }

  deleteSnack(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this snack?')) {
      this.store.dispatch(SnackActions.deleteSnack({ id }));
    }
  }
} 