import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Collaborator, ApiResponse } from '../models/collaborator.model';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  private readonly baseUrl = `${environment.apiUrl}/collaborators`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(this.baseUrl);
  }

  getById(id: string): Observable<Collaborator> {
    return this.http.get<Collaborator>(`${this.baseUrl}/${id}`);
  }

  getByRole(role: string): Observable<Collaborator[]> {
    return this.http.get<Collaborator[]>(`${this.baseUrl}/role/${role}`);
  }

  getProjects(id: string): Observable<unknown[]> {
    return this.http.get<unknown[]>(`${this.baseUrl}/${id}/projects`);
  }

  create(data: Partial<Collaborator> & { mot_de_passe: string }): Observable<ApiResponse<Collaborator>> {
    return this.http.post<ApiResponse<Collaborator>>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Collaborator>): Observable<Collaborator> {
    return this.http.put<Collaborator>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`);
  }
}
