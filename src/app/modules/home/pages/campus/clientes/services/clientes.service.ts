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
      map((responses: any[]) => responses.flatMap(response => response.content)),
      map((processos: any[]) => this.formatarDados(processos)) 
    ).subscribe(clientes => this.clientesSubject.next(clientes));
  }

  adicionarUsuario(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}domain/cliente/add`, payload).pipe(
      map((response: any) => {
        this.carregarTodosUsuarios(); 
        return response;
      })
    );
  }

  atualizarUsuario(id: number, payload: any): Observable<any> {
    return this.http.patch(`${this.API_URL}domain/cliente/${id}`, payload).pipe(
      map((response: any) => {
        this.carregarTodosUsuarios(); 
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
    let filterString = '';
    if (filtros.nome) filterString += `contato.nome ilike '${filtros.nome}'`;
    if (filtros.email) filterString += (filterString ? ' and ' : '') + `contato.email ilike '${filtros.email}'`;
    if (filtros.rg) filterString += (filterString ? ' and ' : '') + `rg ilike '${filtros.rg}'`;
    if (filtros.cpf) filterString += (filterString ? ' and ' : '') + `cpf ilike '${filtros.cpf}'`;

    const params = new HttpParams().set('fields', '*,representante').set('filter', filterString);

    console.log('Parâmetros da requisição:', params.toString());

    return this.http.get(`${this.API_URL}domain/cliente`, { params, ...this.createOptions() }).pipe(
      map((response: any) => {
        response.content = this.formatarDados(response.content);
        return response;
      })
    );
  }

  associarBeneficio(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}domain/contrato/add`, payload, this.createOptions());
  }

  buscarClientePorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}domain/cliente`, {
      params: new HttpParams().set('filter', `id eq ${id}`).set('fields', '*,representante'),
      ...this.createOptions()
    }).pipe(
      map((response: any) => response.content[0]) 
    );
  }

  private formatarDados(processos: any[]): any[] {
    return processos.map((cliente: any) => {
      if (cliente.cpf) {
        return {
          ...cliente,
          cpf: this.formatarCPF(cliente.cpf),
        };
      } else {
        console.error('Estrutura de dados inesperada:', cliente);
        return cliente;
      }
    });
  }

  private formatarCPF(cpf: string): string {
    return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
  }
}