import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment.development";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class FinancasService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private financasSubject = new BehaviorSubject<any[]>([]);

  financas$(): Observable<any[]> {
    return this.financasSubject.asObservable();
  }

  getFinancas(): void {
    const params = new HttpParams().set(
      "fields",
      "*,contrato.cliente.contato.nome,contrato.cliente.cpf,contrato.beneficio",
    );

    this.http
      .get(`${this.API_URL}domain/financeiro`, {
        params,
        ...this.createOptions(),
      })
      .subscribe({
        next: (data: any) => {
          const { content } = data;
          this.financasSubject.next(content);
        },
        error: (err) => {
          console.error("Erro ao buscar dados financeiros", err);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Ocorreu um erro ao buscar os dados financeiros.",
          });
        },
      });
  }

  filterFinancas(filtros: any): Observable<any> {
    let filterString = "";

    if (filtros.nome)
      filterString += `contrato.cliente.contato.nome ilike '${filtros.nome}'`;
    if (filtros.cpf)
      filterString +=
        (filterString ? " and " : "") + `contrato.cliente.cpf ilike '${filtros.cpf}'`;
    if (filtros.beneficio)
      filterString +=
        (filterString ? " and " : "") + `contrato.beneficio eq '${filtros.beneficio}'`;
    if (filtros.situacaoParcela)
      filterString +=
        (filterString ? " and " : "") + `situacaoParcela eq '${filtros.situacaoParcela}'`;
    if (filtros.situacaoPagamento !== undefined)
      filterString +=
        (filterString ? " and " : "") + `situacaoPagamento eq ${filtros.situacaoPagamento}`;

    const params = new HttpParams()
      .set("fields", "*,contrato.cliente.contato.nome,contrato.cliente.cpf,contrato.beneficio")
      .set("filter", filterString);

    return this.http.get(`${this.API_URL}domain/financeiro`, {
      params,
      ...this.createOptions(),
    });
  }

  updateFinanceiro(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.API_URL}domain/financeiro/${id}`, data, this.createOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  generateBoleto(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}domain/financeiro/${id}/boleto`, {}, {
      responseType: 'blob' as 'json',
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  downloadComprovante(id: number): Observable<any> {
    return this.http.patch(`${this.API_URL}domain/financeiro/${id}/comprovante`, {}, {
      responseType: 'blob' as 'json',
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    }).pipe(
      catchError(this.handleError)
    );
  }

  private createOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      }),
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof Blob) {
      error.error.text().then((text) => {
        try {
          const jsonError = JSON.parse(text);
          errorMessage = jsonError.message || errorMessage;
        } catch (e) {
          errorMessage = text;
        }
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: errorMessage,
        });
      });
    } else {
      errorMessage = error.error.message || errorMessage;
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: errorMessage,
      });
    }
    return throwError(errorMessage);
  }
}