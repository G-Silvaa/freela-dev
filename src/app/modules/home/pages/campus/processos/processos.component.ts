import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

import { SelectInputComponent } from '../../../../../shared/components/inputs/select-input/select-input.component';
import { InputDefaultComponent } from '../../../../../shared/components/inputs/input-default/input-default.component';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { AddprocessosModalComponent } from './components/add-processos-modal/add-processos-modal.component';
import { ProcessosService } from './services/processos.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-processos',
  standalone: true,
  imports: [SelectInputComponent, InputDefaultComponent, AddprocessosModalComponent, TableComponent, FormsModule],
  templateUrl: './processos.component.html',
  styleUrls: ['./processos.component.scss']
})
export class ProcessosComponent implements OnInit {
  pessoasData: any[] = [];
  isLoading = false;
  bsModalRef?: BsModalRef;
  private API_URL = environment.apiUrl;
  readonly statusOptions = [
    { value: 'AGUARDANDO', label: 'Aguardando' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'ANALISE', label: 'Análise' },
    { value: 'CUMPRIMENTO_EXIGENCIA', label: 'Cumprimento de exigência' },
    { value: 'ANALISE_ADMINISTRATIVA', label: 'Análise administrativa' },
    { value: 'APROVADO', label: 'Aprovado' },
    { value: 'REPROVADO', label: 'Reprovado' },
  ];

  filtros = {
    Nome: '',
    CPF: '',
    Status: '',
  };

  constructor(
    private processosService: ProcessosService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.loadProcessos();
  }

  get totalProcessos(): number {
    return this.pessoasData.length;
  }

  get processosAprovados(): number {
    return this.pessoasData.filter((item) => item.Status === 'Aprovado').length;
  }

  get processosEmAcompanhamento(): number {
    return this.pessoasData.filter((item) => !['Aprovado', 'Reprovado'].includes(item.Status)).length;
  }

  get cessacoesProximas(): number {
    return this.pessoasData.filter((item) => !!item['Cessação']).length;
  }

  loadProcessos() {
    this.isLoading = true;

    this.processosService.processos$.subscribe((processos) => {
      this.pessoasData = processos;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });

    this.processosService.carregarTodosProcessos();
  }

  limparFiltros() {
    this.filtros = {
      Status:'',
      Nome: '',
      CPF: ''
    };
    this.isLoading = true;
    this.processosService.carregarTodosProcessos();
  }

  aplicarFiltros() {
    if (!this.filtros.Nome && !this.filtros.CPF && !this.filtros.Status) {
      this.isLoading = true;
      this.processosService.carregarTodosProcessos();
      return;
    }

    this.isLoading = true;
    const filtrosComLabel = {
      ...this.filtros,
      CPF: this.limparCPF(this.filtros.CPF),
      Status: this.filtros.Status
    };
    this.processosService.buscarProcessosComFiltros(filtrosComLabel).subscribe(
      (response) => {
        if (Array.isArray(response.content)) {
          this.pessoasData = response.content;
        }
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erro ao filtrar',
          text: 'Não foi possível carregar os processos com os filtros informados.',
        });
      }
    );
  }

  limparCPF(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  onEdit(item: any) {
    const processoId = item.id || item.nome?.id;

    if (!processoId) {
      return;
    }

    const initialState = {
      title: 'Editar um Processo',
      processoId: processoId
    };

    this.bsModalRef = this.modalService.show(AddprocessosModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  onDelete(item: any) {
    console.log('Delete item:', item);
  }

  gerarCarta(event: { id: any, tipo: any }) {
    const { id, tipo } = event;
    let url = '';

    switch (tipo) {
      case 'pericia-medica':
        url = `${this.API_URL}domain/processo/${id}/carta-de-pericia-medica`;
        break;
      case 'avaliacao-social':
        url = `${this.API_URL}domain/processo/${id}/carta-de-avaliacao-social`;
        break;
      case 'concessao':
        url = `${this.API_URL}domain/processo/${id}/carta-de-concessao`;
        break;
    }

    this.processosService.gerarCarta(url).subscribe(
      (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'download.pdf';
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      (error) => {
        if (error.error instanceof Blob && error.error.type === 'application/problem+json') {
          const reader = new FileReader();
          reader.onload = () => {
            const errorResponse = JSON.parse(reader.result as string);
            Swal.fire({
              icon: 'error',
              title: errorResponse.title || 'Erro',
              text: errorResponse.detail || 'Ocorreu um erro ao gerar a carta.',
            });
          };
          reader.readAsText(error.error);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao gerar carta',
            text: 'Ocorreu um erro ao gerar a carta.',
          });
        }
      }
    );
  }
}
