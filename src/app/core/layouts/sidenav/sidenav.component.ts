import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter } from 'rxjs/operators';

import { SidebarService } from '@core/services/sidebar/sidebar.service';
interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  description: string;
}

interface PageMeta {
  eyebrow: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  screenWidth = 0;
  readonly todayLabel = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
  readonly navigationItems: NavigationItem[] = [
    {
      label: 'Painel',
      route: '/home',
      icon: 'bi-grid-1x2-fill',
      description: 'Resumo e prioridades',
    },
    {
      label: 'Clientes',
      route: '/clientes',
      icon: 'bi-people-fill',
      description: 'Cadastros e contatos',
    },
    {
      label: 'Processos',
      route: '/processos',
      icon: 'bi-clipboard2-pulse-fill',
      description: 'Status e exigências',
    },
    {
      label: 'Contratos',
      route: '/contratos',
      icon: 'bi-file-earmark-text-fill',
      description: 'Vigência e renovação',
    },
    {
      label: 'Finanças',
      route: '/financas',
      icon: 'bi-bank2',
      description: 'Cobrança e baixa',
    },
  ];
  readonly pageMeta: Record<string, PageMeta> = {
    '/home': {
      eyebrow: 'Resumo do dia',
      title: 'Visão geral',
      description:
        'Acompanhe alertas, carteira ativa e os próximos movimentos da operação em uma leitura mais objetiva.',
    },
    '/clientes': {
      eyebrow: 'Atendimento',
      title: 'Clientes e representantes',
      description:
        'Organize cadastros, documentos e contatos de forma direta.',
    },
    '/processos': {
      eyebrow: 'Acompanhamento',
      title: 'Processos em andamento',
      description:
        'Visualize status, prazos e ações pendentes sem sair da listagem.',
    },
    '/contratos': {
      eyebrow: 'Contratos',
      title: 'Contratos e vigência',
      description:
        'Consulte contratos ativos, renovações disponíveis e emissão de documentos.',
    },
    '/financas': {
      eyebrow: 'Financeiro',
      title: 'Financeiro da carteira',
      description:
        'Controle parcelas, boletos e comprovantes com leitura mais rápida.',
    },
  };
  currentPage = this.pageMeta['/home'];

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
  ) {}

  get isActiveBar(): boolean {
    return this.sidebarService.isActive;
  }

  toggleSideBar(): void {
    if (this.isActiveBar) {
      this.sidebarService.onInactiveSide();
    } else {
      this.sidebarService.onActiveSide();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > 992) {
      this.sidebarService.onInactiveSide();
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.updatePageMeta(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updatePageMeta(event.urlAfterRedirects);

        if (this.screenWidth <= 992) {
          this.sidebarService.onInactiveSide();
        }
      });
  }

  closeSidenav(): void {
    this.sidebarService.onInactiveSide();
  }

  isExactRoute(route: string): boolean {
    return route === '/home';
  }

  private updatePageMeta(url: string): void {
    const matchedRoute =
      Object.keys(this.pageMeta)
        .sort((left, right) => right.length - left.length)
        .find((route) => (route === '/home' ? url === route : url.startsWith(route))) ??
      '/home';

    this.currentPage = this.pageMeta[matchedRoute];
  }
}
