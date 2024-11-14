import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { map, mergeMap, toArray } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private API_URL = environment.apiUrl;
  private clienteAdicionadoSubject = new Subject<any>();
  private clienteDeletadoSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  adicionarUsuario(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}domain/cliente/add`, payload);
  }

  createOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    }; 
    return httpOptions;
  }

  pegarUsuario(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.API_URL}domain/cliente`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('fields', '*,representante'),
      ...this.createOptions()
    });
  }

  pegarTodosUsuarios(): Observable<any[]> {
    return this.pegarUsuario().pipe(
      mergeMap((response: any) => {
        const totalPages = response.totalPages;
        const requests = [];
        for (let page = 0; page < totalPages; page++) {
          requests.push(this.pegarUsuario(page));
        }
        return forkJoin(requests);
      }),
      map((responses: any[]) => {
        return responses.flatMap(response => response.content);
      })
    );
  }

  deletarUsuario(id: any): Observable<any> {
    return this.http.delete(`${this.API_URL}domain/cliente/${id}`);
  }

  atualizarUsuario(id: any, payload: any): Observable<any> {
    return this.http.put(`${this.API_URL}domain/cliente/${id}`, payload);
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