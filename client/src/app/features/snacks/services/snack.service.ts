import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Snack, SnackResponse, CreateSnackDto, UpdateSnackDto } from '../models/snack.model';

const SNACKS_API = 'api/snacks';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private http: HttpClient) { }

  getSnacks(page: number = 0, size: number = 10, category?: string): Observable<SnackResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<SnackResponse>(SNACKS_API, { params });
  }

  getSnackById(id: number): Observable<Snack> {
    return this.http.get<Snack>(`${SNACKS_API}/${id}`);
  }

  createSnack(snack: CreateSnackDto): Observable<Snack> {
    return this.http.post<Snack>(SNACKS_API, snack);
  }

  updateSnack(id: number, snack: UpdateSnackDto): Observable<Snack> {
    return this.http.put<Snack>(`${SNACKS_API}/${id}`, snack);
  }

  deleteSnack(id: number): Observable<void> {
    return this.http.delete<void>(`${SNACKS_API}/${id}`);
  }

  searchSnacks(query: string, page: number = 0, size: number = 10): Observable<SnackResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<SnackResponse>(`${SNACKS_API}/search`, { params });
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${SNACKS_API}/upload`, formData);
  }
} 