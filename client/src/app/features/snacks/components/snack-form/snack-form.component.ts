import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Snack, SnackCategory } from '../../models/snack.model';
import * as SnackActions from '../../store/snack.actions';
import { selectSelectedSnack, selectSnackLoading, selectSnackError } from '../../store/snack.selectors';

@Component({
  selector: 'app-snack-form',
  templateUrl: './snack-form.component.html',
  styleUrls: ['./snack-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class SnackFormComponent implements OnInit {
  snackForm: FormGroup;
  isEditMode = false;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  selectedFile: File | undefined;
  imagePreview: string | null = null;
  categories: SnackCategory[] = ['CHIPS', 'CANDY', 'CHOCOLATE', 'NUTS', 'BEVERAGES', 'OTHER'];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loading$ = this.store.select(selectSnackLoading);
    this.error$ = this.store.select(selectSnackError);

    this.snackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      brand: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.store.dispatch(SnackActions.loadSnack({ id: +id }));
      this.store.select(selectSelectedSnack)
        .pipe(
          tap(snack => {
            if (snack) {
              this.snackForm.patchValue({
                name: snack.name,
                brand: snack.brand,
                description: snack.description,
                category: snack.category,
                price: snack.price
              });
              if (snack.imageUrl) {
                this.imagePreview = snack.imageUrl;
              }
            }
          })
        )
        .subscribe();
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = undefined;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.snackForm.valid) {
      const snackData = {
        name: this.snackForm.get('name')?.value,
        brand: this.snackForm.get('brand')?.value,
        description: this.snackForm.get('description')?.value,
        category: this.snackForm.get('category')?.value,
        price: Number(this.snackForm.get('price')?.value)
      };

      const formData = new FormData();
      Object.keys(snackData).forEach(key => {
        const value = snackData[key as keyof typeof snackData];
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      if (this.isEditMode) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (id) {
          const updateData = {
            ...snackData,
            id
          };
          this.store.dispatch(SnackActions.updateSnack({
            id,
            snack: updateData
          }));
        }
      } else {
        this.store.dispatch(SnackActions.createSnack({ snack: snackData }));
      }
    } else {
      this.markFormGroupTouched(this.snackForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.snackForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be greater than 0`;
    }
    return '';
  }
} 