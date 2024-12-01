import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GraficosService {
  private readonly API_URL = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getDados(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
    });

    const params = { size: '6' };

    return this.http.get(`${this.API_URL}domain/relatorio/query/recentes`, { headers, params });
  }

  getDadosDaTabela(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
    });

    return this.http.get(`${this.API_URL}processo/cessacao`, { headers }).pipe(
      map((response: any) => {
        response.content = this.formatarDados(response.content);
        return response;
      })
    );
  }

  getDadosConcedidos(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': '1',
    });

    return this.http.get(`${this.API_URL}processo/concedido`, { headers }).pipe(
      map((response: any) => {
        response.content = this.formatarDados(response.content);
        return response;
      })
    );
  }

  private formatarDados(dados: any[]): any[] {
    return dados.map((item: any) => ({
      Nome: item.nome,
      CPF: this.formatarCPF(item.cpf),
      Telefone: item.telefone,
      'Numero do Protocolo': item.numeroProtocolo,
      Status: this.formatarStatus(item.status),
      Beneficio: item.beneficio,
      'Data de Concessão': this.formatarData(item.dataConcessao),
      Cessação: item.cessacao ? this.formatarData(item.cessacao) : '',
    }));
  }

  private formatarCPF(cpf: string): string {
    return cpf ? cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : '';
  }

  private formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private formatarStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'AGUARDANDO': 'Aguardando',
      'PENDENTE': 'Pendente',
      'ANALISE': 'Análise',
      'CUMPRIMENTO_EXIGENCIA': 'Cumprimento com Exigência',
      'ANALISE_ADMINISTRATIVA': 'Análise Administrativa',
      'APROVADO': 'Aprovado',
      'REPROVADO': 'Reprovado'
    };
    return statusMap[status] || status;
  }
}