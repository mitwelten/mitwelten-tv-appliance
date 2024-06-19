import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StackQuery } from '../shared/stack-query.type';
import { StackImage } from '../shared/stack-image.type';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private readonly http: HttpClient) { }

  public getImageStack(selection: StackQuery) {
    return this.http.post<StackImage[]>(`${environment.apiUrl}/tv/stack-selection/`, selection);
  }

  public getImageResource(url: string) {
    return this.http.get(`${environment.apiUrl}/tv/file/${url}`, {responseType: 'blob'});
  }
}
