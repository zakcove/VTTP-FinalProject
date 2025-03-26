import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';

import { CreateReviewRequest } from '../../models/create-review-request.model';
import * as ReviewActions from '../../store/review.actions';
import { selectReviewLoading, selectReviewError } from '../../store/review.selectors';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterModule,
    GoogleMapsModule
  ]
})
export class ReviewFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(GoogleMap) map!: GoogleMap;

  reviewForm: FormGroup;
  selectedFile: File | undefined;
  imagePreview: string | null = null;
  loading$ = this.store.select(selectReviewLoading);
  error$ = this.store.select(selectReviewError);
  
  // Map configuration
  center: google.maps.LatLngLiteral = { lat: 1.3521, lng: 103.8198 }; // Singapore
  zoom = 11;
  markerPosition: google.maps.LatLngLiteral | undefined;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 8,
  };
  isMapLoaded = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      locationName: ['', Validators.required],
      isPublic: [true]
    });
  }

  ngOnInit(): void {
    // Check if Google Maps is loaded
    if (typeof google === 'undefined') {
      this.snackBar.open('Google Maps failed to load. Please try again later.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.isMapLoaded = true;

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            this.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.markerPosition = this.center;
            this.getAddressFromLatLng(this.center);
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.snackBar.open('Could not get your current location. Please select a location on the map.', 'Close', {
            duration: 5000
          });
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.snackBar.open('Image size should not exceed 5MB', 'Close', {
          duration: 3000
        });
        return;
      }
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
    this.fileInput.nativeElement.value = '';
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddressFromLatLng(this.markerPosition);
    }
  }

  private getAddressFromLatLng(position: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: position },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        this.ngZone.run(() => {
          if (status === 'OK' && results && results[0]) {
            this.reviewForm.patchValue({
              locationName: results[0].formatted_address
            });
          } else {
            this.snackBar.open('Could not determine the address for this location', 'Close', {
              duration: 3000
            });
          }
        });
      }
    );
  }

  onSubmit(): void {
    if (!this.isMapLoaded) {
      this.snackBar.open('Please wait for the map to load', 'Close', {
        duration: 3000
      });
      return;
    }

    if (this.reviewForm.valid) {
      const snackId = Number(this.route.snapshot.paramMap.get('id'));
      
      const reviewData: CreateReviewRequest = {
        snackId: snackId,
        rating: Number(this.reviewForm.get('rating')?.value) || 0,
        comment: this.reviewForm.get('comment')?.value || '',
        locationName: this.reviewForm.get('locationName')?.value || '',
        isPublic: this.reviewForm.get('isPublic')?.value ?? true
      };

      this.store.dispatch(ReviewActions.createReview({ reviewData, image: this.selectedFile }));
    } else {
      this.markFormGroupTouched(this.reviewForm);
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
    const control = this.reviewForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least 1`;
    }
    if (control?.hasError('max')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at most 5`;
    }
    return '';
  }
} 