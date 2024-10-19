import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  constructor() {}

  isActive: boolean = false;

  onActiveSide() {
    this.isActive = true;
  }

  onInactiveSide() {
    this.isActive = false;
  }
}
