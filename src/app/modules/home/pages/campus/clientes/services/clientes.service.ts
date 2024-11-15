import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private API_URL = environment.apiUrl;
  private clientesSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  get clientes$(): Observable<any[]> {
    return this.clientesSubject.asObservable();
  }

  createOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    };
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

  carregarTodosUsuarios(): void {
    this.pegarUsuario().pipe(
      mergeMap((response: any) => {
        const totalPages = response.totalPages;
        const requests = [];
        for (let page = 0; page < totalPages; page++) {
          requests.push(this.pegarUsuario(page));
        }
        return forkJoin(requests);
      }),
      map((responses: any[]) => responses.flatMap(response => response.content))
    ).subscribe(clientes => this.clientesSubject.next(clientes));
  }

  adicionarUsuario(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}domain/cliente/add`, payload).pipe(
      map((response: any) => {
        this.carregarTodosUsuarios(); // Atualiza a lista após adicionar
        return response;
      })
    );
  }

  deletarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}domain/cliente/${id}`).pipe(
      map(() => {
        this.carregarTodosUsuarios(); 
      })
    );
  }

  buscarClientesComFiltros(filtros: any): Observable<any> {
    let params = new HttpParams().set('fields', '*,representante');
    if (filtros.nome) params = params.set('filter', `contato.nome ilike '${filtros.nome}'`);
    if (filtros.email) params = params.set('filter', `contato.email ilike '${filtros.email}'`);
    if (filtros.rg) params = params.set('filter', `rg like '${filtros.rg}'`);
    if (filtros.cpf) params = params.set('filter', `cpf like '${filtros.cpf}'`);

    return this.http.get(`${this.API_URL}domain/cliente`, { params, ...this.createOptions() });
  }
}
