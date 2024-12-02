import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRelatorioIntervalo } from '@core/interfaces/relatorios/relatorios.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class RelatoriosService {
  private http = inject(HttpClient);
  private API_URL = environment.apiUrl;

  downloadRelatorioIntervalo(data: IRelatorioIntervalo, relatorioNome: string) {
    this.http.post(`${this.API_URL}domain/service/relatorio-service/${relatorioNome}`, data,  {
      responseType: 'blob' as 'json',
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    }
    ).subscribe({
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

  downloadRelatorioMes(relatorioNome: string, anoMes: string) {
    this.http.patch(`${this.API_URL}domain/relatorio/${anoMes}/${relatorioNome}`, {}, {
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

  createOptions() {
    return {
      headers: new Headers({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '1',
      }),
    };
  }

}
