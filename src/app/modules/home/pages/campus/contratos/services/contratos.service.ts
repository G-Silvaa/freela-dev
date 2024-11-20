import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class ContratosService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private contratosSubject = new BehaviorSubject<any[]>([]);

  contratos$(): Observable<any[]> {
    return this.contratosSubject.asObservable();
  }

  getContratos(): void {
    const params = new HttpParams().set(
      "fields",
      "*,cliente,beneficio,processos",
    );

    this.http
      .get(`${this.API_URL}domain/contrato`, {
        params,
        ...this.createOptions(),
      })
      .subscribe({
        next: (data: any) => {
          const { content } = data;
          this.contratosSubject.next(content);
        },
      });
  }

  editContrato(data: any) {
    const { id, ...editable } = data;
    return this.http.patch(
      `${this.API_URL}domain/contrato/${data.id}`,
      editable,
    );
  }

  filterContratos(filtros: any): Observable<any> {
    let filterString = "";

    if (filtros.nome)
      filterString += `cliente.contato.nome ilike '${filtros.nome}'`;
    if (filtros.cpf)
      filterString +=
        (filterString ? " and " : "") + `cliente.cpf ilike '${filtros.cpf}'`;
    if (filtros.beneficio)
      filterString +=
        (filterString ? " and " : "") + `beneficio eq '${filtros.beneficio}'`;

    const params = new HttpParams()
      .set("fields", "*,cliente,processos")
      .set("filter", filterString);

    return this.http.get(`${this.API_URL}domain/contrato`, {
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
