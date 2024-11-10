import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private  API_URL = 'https://6554daaf63cafc694fe71c07.mockapi.io/clientes';

  constructor(private  http: HttpClient) {}

  adicionarUsuario(payload: any): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
  pegarUsuario(): Observable<any> {
    return this.http.get(this.API_URL);
  }
}
