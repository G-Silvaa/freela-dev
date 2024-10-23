import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MenuItemComponent } from './menu-item/menu-item.component';

import { SidebarService } from '@core/services/sidebar/sidebar.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MenuItemComponent,
    LucideAngularModule
  ],
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
    trigger('rotate', [
      transition(':enter', [
        animate(
          '1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' }),
          ]),
        ),
      ]),
    ]),
  ],
})
export class SidenavComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true;
  screenWidth = 0;
  isDropdownOpen = false;
  imageUrl?: string | ArrayBuffer | null = null;
  animationClass = '';
  isInitialPage: boolean = false;
  selectedNav: number = 0;

  selectNav(navNumber: number): void {
    this.selectedNav = navNumber;
  }

  headerTitle!: string;
  headerDescription!: string;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  get isActiveBar(): boolean {
    return this.sidebarService.isActive;
  }



  openSideBar(): void {
    this.sidebarService.onActiveSide();
  }

  closeSideBar(): void {
    this.sidebarService.onInactiveSide();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  dropdownMenu() {
    if (this.isDropdownOpen) {
      this.animationClass = 'closing';
      setTimeout(() => {
        this.isDropdownOpen = false;
        this.animationClass = '';
      }, 20);
    } else {
      this.isDropdownOpen = true;
      this.animationClass = 'opening';
      setTimeout(() => {
        this.animationClass = '';
      }, 20);
    }
  }




}
