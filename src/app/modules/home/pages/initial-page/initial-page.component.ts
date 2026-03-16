import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableComponent } from "../../../../shared/components/table/table.component";
import {
  DashboardOverview,
  DashboardStatusSummary,
  GraficosService,
} from '@modules/home/pages/initial-page/services/initial.service';
import { forkJoin } from 'rxjs';

interface QuickLinkItem {
  label: string;
  route: string;
  icon: string;
}

interface PriorityItem {
  label: string;
  description: string;
  value: number;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
})
export class InitialPageComponent implements OnInit {
  overview?: DashboardOverview;
  pessoasData: any[] = [];
  pessoasDataConcedido: any[] = [];
  isLoading = false;
  readonly statusLabels: Record<string, string> = {
    AGUARDANDO: 'Aguardando',
    PENDENTE: 'Pendente',
    ANALISE: 'Em análise',
    CUMPRIMENTO_EXIGENCIA: 'Exigência',
    ANALISE_ADMINISTRATIVA: 'Análise administrativa',
    APROVADO: 'Concedido',
    REPROVADO: 'Indeferido',
  };
  readonly quickLinks: QuickLinkItem[] = [
    { label: 'Clientes', route: '/clientes', icon: 'bi-people-fill' },
    { label: 'Processos', route: '/processos', icon: 'bi-clipboard2-pulse-fill' },
    { label: 'Contratos', route: '/contratos', icon: 'bi-file-earmark-text-fill' },
    { label: 'Finanças', route: '/financas', icon: 'bi-bank2' },
  ];

  constructor(private readonly graficosService: GraficosService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  get totalProcessosEmAlerta(): number {
    return this.pessoasData.length + this.pessoasDataConcedido.length;
  }

  get statusProcessos(): DashboardStatusSummary[] {
    return this.overview?.statusProcessos ?? [];
  }

  get maxStatusValue(): number {
    return Math.max(...this.statusProcessos.map((status) => status.total), 1);
  }

  get priorityItems(): PriorityItem[] {
    if (!this.overview) {
      return [];
    }

    return [
      {
        label: 'Casos em cessação',
        description: 'Clientes que pedem contato e revisão imediata.',
        value: this.pessoasData.length,
        route: '/processos',
        icon: 'bi-hourglass-split',
      },
      {
        label: 'Concedidos recentes',
        description: 'Benefícios próximos da janela de 60 dias.',
        value: this.pessoasDataConcedido.length,
        route: '/processos',
        icon: 'bi-check2-circle',
      },
      {
        label: 'Financeiros em aberto',
        description: 'Cobranças aguardando baixa ou acompanhamento.',
        value: this.overview.financeirosEmAberto,
        route: '/financas',
        icon: 'bi-cash-stack',
      },
      {
        label: 'Contratos encerrados',
        description: 'Vínculos que podem exigir renovação.',
        value: this.overview.contratosEncerrados,
        route: '/contratos',
        icon: 'bi-arrow-repeat',
      },
    ];
  }

  statusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  statusWidth(total: number): number {
    return (total / this.maxStatusValue) * 100;
  }

  formatCurrency(value: number = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(value);
  }

  private loadDashboard(): void {
    this.isLoading = true;

    forkJoin({
      overview: this.graficosService.getOverview(),
      cessacao: this.graficosService.getDadosDaTabela(),
      concedidos: this.graficosService.getDadosConcedidos(),
    }).subscribe({
      next: ({ overview, cessacao, concedidos }) => {
        this.overview = overview;
        this.pessoasData = cessacao.content;
        this.pessoasDataConcedido = concedidos.content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
