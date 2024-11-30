import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GraficosService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getDados(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
    });

    const params = { size: '6' };

    return this.http.get(`${this.API_URL}domain/relatorio/query/recentes`, { headers, params });
  }
}