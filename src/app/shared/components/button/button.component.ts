import { Component, Input, input } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() isLoading: boolean = false;
  @Input() width: string | null = null;
  @Input() size: string | null = null;
  @Input() variant: 'primary' | 'danger' | 'info' | 'warning' | null =
    'primary';

  get backgroundColor(): string {
    switch (this.variant) {
      case 'primary':
        return 'var(--primary)';
      case 'danger':
        return 'var(--danger)';
      case 'info':
        return 'var(--info)';
      case 'warning':
        return 'var(--warning)';
      default:
        return 'var(--primary)';
    }
  }
}
