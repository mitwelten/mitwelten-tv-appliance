import { HttpClient, HttpParams } from '@angular/common/http';
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
    let params = { deployment_id: selection.deployment_id };
    if (selection.period.start) params = Object.assign(params,{period_start: selection.period.start});
    if (selection.period.end) params = Object.assign(params, {period_end: selection.period.end});
    if (selection.interval) params = Object.assign(params, {interval: selection.interval});
    if (selection.phase) params = Object.assign(params, {phase: selection.phase});
    return this.http.get<StackImage[]>(`${environment.apiUrl}/tv/stack-selection/`, { params });
  }

  public getImageResource(url: string) {
    return this.http.get(`${environment.apiUrl}/tv/file/${url}`, {responseType: 'blob'});
  }
}
