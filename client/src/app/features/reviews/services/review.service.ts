import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewResponse, ReviewStats } from '../models/review.model';
import { CreateReviewRequest } from '../models/create-review-request.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly baseUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(
    snackId: number,
    page: number = 0,
    size: number = 10,
    sort: string = 'newest',
    moderatedOnly: boolean = true
  ): Observable<ReviewResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)
      .set('moderatedOnly', moderatedOnly.toString());

    if (snackId) {
      params = params.set('snackId', snackId.toString());
    }

    return this.http.get<ReviewResponse>(this.baseUrl, { params });
  }

  getReviewStats(snackId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.baseUrl}/stats/${snackId}`);
  }

  createReview(reviewData: CreateReviewRequest, image?: File): Observable<Review> {
    if (!image) {
      // If no image, send JSON directly
      return this.http.post<Review>(this.baseUrl, reviewData);
    }

    // If there's an image, use FormData
    const formData = new FormData();
    formData.append('review', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Review>(this.baseUrl, formData, {
      headers: new HttpHeaders().delete('Content-Type') // Let the browser set the content type for FormData
    });
  }

  moderateReview(reviewId: number, approved: boolean): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${reviewId}/moderate`, { approved });
  }
}