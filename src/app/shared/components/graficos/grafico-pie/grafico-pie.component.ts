import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './grafico-pie.component.html',
  styleUrls: ['./grafico-pie.component.scss']
})
export class PieChartComponent {
  view: [number, number] = [700, 400]; // Tamanho do gráfico

  // Dados do gráfico
  data = [
    {
      "name": "Clientes",
      "value": 1000
    },
    {
      "name": "Processos",
      "value": 200
    },
    {
      "name": "Contratos",
      "value": 5000
    },
   
  ];

  // Opções de personalização
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(event: any): void {
    console.log(event);
  }
}