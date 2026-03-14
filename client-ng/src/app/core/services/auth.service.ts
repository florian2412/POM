import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  Collaborator,
  LoginCredentials,
  ApiResponse,
} from '../models/collaborator.model';

const TOKEN_KEY = 'pom_jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  // Angular signals for reactive state
  private _currentUser = signal<Collaborator | null>(this.loadUserFromStorage());
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => this._currentUser()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem(TOKEN_KEY, res.token);
          localStorage.setItem('pom_user', JSON.stringify(res.collaborator));
          this._token.set(res.token);
          this._currentUser.set(res.collaborator);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('pom_user');
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  changePassword(payload: { current_password: string; new_password: string }): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/auth/change-password`, payload);
  }

  resetPassword(pseudo: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/auth/reset-password`, { pseudo });
  }

  refreshCurrentUser(): Observable<{ success: boolean; collaborator: Collaborator }> {
    return this.http.get<{ success: boolean; collaborator: Collaborator }>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem('pom_user', JSON.stringify(res.collaborator));
          this._currentUser.set(res.collaborator);
        }
      })
    );
  }

  private loadUserFromStorage(): Collaborator | null {
    try {
      const raw = localStorage.getItem('pom_user');
      return raw ? (JSON.parse(raw) as Collaborator) : null;
    } catch {
      return null;
    }
  }
}
