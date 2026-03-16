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
  currentUrl = '';
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

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
  ) {}

  get isActiveBar(): boolean {
    return this.sidebarService.isActive;
  }

  get isPainelPage(): boolean {
    return this.currentUrl === '/home';
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
    this.currentUrl = this.normalizeUrl(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = this.normalizeUrl(event.urlAfterRedirects);

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

  private normalizeUrl(url: string): string {
    return url.split('?')[0].split('#')[0];
  }
}
