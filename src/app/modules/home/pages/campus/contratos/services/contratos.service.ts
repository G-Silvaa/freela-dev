import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getContratos$(): Observable<any> {
    const params = new HttpParams().set('fields', '*,cliente,beneficio,processos');

    return this.http.get(`${this.API_URL}domain/contrato`, { params, ...this.createOptions()})
  }

  private createOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    };
  }

}
