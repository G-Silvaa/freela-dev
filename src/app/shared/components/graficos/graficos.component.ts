import { Component } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss'
})
export class GraficosComponent {
  view: [number, number] = [700, 400]; // Tamanho do gráfico

  // Dados do gráfico
  data = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    },
    {
      "name": "Italy",
      "value": 4200000
    },
    {
      "name": "Spain",
      "value": 8200000
    }
  ];

  // Opções de personalização
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
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
