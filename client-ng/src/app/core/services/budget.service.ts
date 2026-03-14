import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Budget } from '../models/budget.model';
import { ApiResponse } from '../models/collaborator.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly baseUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Budget[]> {
    return this.http.get<Budget[]>(this.baseUrl);
  }

  getById(id: string): Observable<Budget> {
    return this.http.get<Budget>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Budget>): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Budget>): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }
}
