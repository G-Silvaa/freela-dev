import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
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

  private createOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
      }),
    };
  }
}