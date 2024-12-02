import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import Swal from "sweetalert2";

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
      "*,cliente",
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

  deleteContrato(id: any) {
    this.http.delete(`${this.API_URL}domain/contrato/${id}`).subscribe({
      next: (res) => {
        this.getContratos();
      }
    })
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

  downloadAndSaveFile(id: any) {
    this.http.patch(`${this.API_URL}domain/contrato/${id}/gerar-contrato`, {}, {
      responseType: 'blob' as 'json',
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    }).subscribe({
      next: (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].trim()
          : 'download.pdf';

        if (response.body) {
          const blob = new Blob([response.body as Blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          console.log('Carta gerada com sucesso:', response);
        } else {
          console.error('Resposta vazia ou inválida:', response);
        }
      },
      error: (error) => {
        console.error('Erro ao baixar o arquivo', error);
      },
    });
  }



  renewContract(id: any): void {
    this.http
      .patch(
        `${this.API_URL}domain/contrato/${id}/renovar`,
        this.createOptions(),
      )
      .subscribe({
        next: (res) => {
          console.log(res, "resposta contrato");
          Swal.fire({
            icon: "success",
            title: "Êxito",
            text: "Contrato renovado com sucesso!",
            timer: 2000,
          });
          this.getContratos();
        },
        error: (err) => {
          console.log(err);
          const { error } = err;
          Swal.fire({
            icon: error.title === "Atenção" ? "warning" : "error",
            title: error.title || "Erro!",
            text: error.detail || "Erro ao tentar renovar este contrato.",
          });
        },
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
