import { Component, Input } from '@angular/core';

@Component({
  selector: 'intra-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() width: string = '1.25rem';
  @Input() height: string = '1.25rem';
}
