import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'sidenav-menu-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  @Input() label!: string;
  @Input() path!: string;
  @Input() classIcon!: string;
 

}
