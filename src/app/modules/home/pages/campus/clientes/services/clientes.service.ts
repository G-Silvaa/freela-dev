import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private API_URL = 'https://6554daaf63cafc694fe71c07.mockapi.io/clientes';
  private clienteAdicionadoSubject = new Subject<any>();
  private clienteDeletadoSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  adicionarUsuario(payload: any): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }

  pegarUsuario(): Observable<any> {
    return this.http.get(this.API_URL);
  }

  deletarUsuario(id: any): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  get clienteAdicionado$(): Observable<any> {
    return this.clienteAdicionadoSubject.asObservable();
  }

  get clienteDeletado$(): Observable<any> {
    return this.clienteDeletadoSubject.asObservable();
  }

  emitirClienteAdicionado(cliente: any) {
    this.clienteAdicionadoSubject.next(cliente);
  }

  emitirClienteDeletado(id: any) {
    this.clienteDeletadoSubject.next(id);
  }
}