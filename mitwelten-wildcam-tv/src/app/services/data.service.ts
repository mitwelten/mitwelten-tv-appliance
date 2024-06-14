import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StackQuery } from '../shared/stack-query.type';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8000';

  constructor(private readonly http: HttpClient) { }

  public getImageStack(selection: StackQuery) {
    return this.http.post(`${this.apiUrl}/tv/stack-selection/`, selection);
  }

  public getImageResource(url: string) {
    return this.http.get(`${this.apiUrl}/tv/file/${url}`, {responseType: 'blob'});
  }
}
