import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppSettings {
  roles: string[];
  statuts: string[];
  fonctions: string[];
  categories: string[];
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly baseUrl = `${environment.apiUrl}/settings`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AppSettings> {
    return this.http.get<AppSettings>(this.baseUrl);
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/roles`);
  }

  getFonctions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/fonctions`);
  }

  getStatuts(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/statuts`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`);
  }
}
