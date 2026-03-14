import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { ApiResponse } from '../models/collaborator.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  private url(projectId: string): string {
    return `${environment.apiUrl}/projects/${projectId}/tasks`;
  }

  getAll(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.url(projectId));
  }

  getById(projectId: string, taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.url(projectId)}/${taskId}`);
  }

  create(projectId: string, data: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(this.url(projectId), data);
  }

  update(projectId: string, taskId: string, data: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.url(projectId)}/${taskId}`, data);
  }

  delete(projectId: string, taskId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.url(projectId)}/${taskId}`);
  }
}
