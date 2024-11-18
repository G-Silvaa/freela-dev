import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProcessosService {
  private API_URL = environment.apiUrl;
  private processosSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  get processos$(): Observable<any[]> {
    return this.processosSubject.asObservable();
  }

  createOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    };
  }

  pegarProcesso(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.API_URL}domain/processo`, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('fields', '*,contrato.cliente'), // Ajuste conforme o novo endpoint
      ...this.createOptions()
    });
  }

  carregarTodosProcessos(): void {
    this.pegarProcesso().pipe(
      mergeMap((response: any) => {
        const totalPages = response.totalPages;
        const requests = [];
        for (let page = 0; page < totalPages; page++) {
          requests.push(this.pegarProcesso(page));
        }
        return forkJoin(requests);
      }),
      map((responses: any[]) => responses.flatMap(response => response.content))
    ).subscribe(processos => this.processosSubject.next(processos));
  }

  adicionarProcesso(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}domain/processo/add`, payload).pipe(
      map((response: any) => {
        this.carregarTodosProcessos(); 
        return response;
      })
    );
  }

  atualizarProcesso(id: number, payload: any): Observable<any> {
    return this.http.patch(`${this.API_URL}domain/processo/${id}`, payload).pipe(
      map((response: any) => {
        this.carregarTodosProcessos(); 
        return response;
      })
    );
  }

  deletarProcesso(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}domain/processo/${id}`).pipe(
      map(() => {
        this.carregarTodosProcessos(); 
      })
    );
  }

  buscarProcessosComFiltros(filtros: any): Observable<any> {
    let filterString = '';
    if (filtros.nome) filterString += `contato.nome ilike '${filtros.nome}'`;
    if (filtros.email) filterString += (filterString ? ' and ' : '') + `contato.email ilike '${filtros.email}'`;
    if (filtros.rg) filterString += (filterString ? ' and ' : '') + `rg ilike '${filtros.rg}'`;
    if (filtros.cpf) filterString += (filterString ? ' and ' : '') + `cpf ilike '${filtros.cpf}'`;

    const params = new HttpParams().set('fields', '*,contrato.cliente').set('filter', filterString);

    console.log('Parâmetros da requisição:', params.toString());

    return this.http.get(`${this.API_URL}/liv-api/domain/processo`, { params, ...this.createOptions() });
  }

  associarBeneficio(payload: any): Observable<any> {
    return this.http.post(`${this.API_URL}/liv-api/domain/contrato/add`, payload, this.createOptions());
  }

  buscarProcessoPorId(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/liv-api/domain/processo`, {
      params: new HttpParams().set('filter', `id eq ${id}`).set('fields', '*,contrato.cliente'),
      ...this.createOptions()
    }).pipe(
      map((response: any) => response.content[0]) 
    );
  }
}
