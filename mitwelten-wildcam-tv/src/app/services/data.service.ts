import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:8000';

  constructor(private readonly http: HttpClient) { }

  public getImageStack(selection: any) {
    return this.http.post(`${this.apiUrl}/tv/stack-selection/`, {});
  }

  public getImageResource(url: string) {
    return this.http.get(`${this.apiUrl}/tv/file/${url}`, {responseType: 'blob'});
  }
}
