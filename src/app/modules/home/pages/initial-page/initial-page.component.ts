import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GraficosComponent } from "../../../../shared/components/graficos/graficos.component";
import { PieChartComponent } from "../../../../shared/components/graficos/grafico-pie/grafico-pie.component";


@Component({
  selector: 'app-initial-page',
  standalone: true,
  imports: [CommonModule, GraficosComponent, PieChartComponent],
  templateUrl: './initial-page.component.html',
  styleUrl: './initial-page.component.scss',
})
export class InitialPageComponent {
 
}
