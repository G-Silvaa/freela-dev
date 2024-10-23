import { Component } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent {
  view: [number, number] = [700, 400]; // Tamanho do gráfico

  // Dados do gráfico
  data = [
    {
      "name": "Processos",
      "value": 1000
    },
    {
      "name": "Contratos",
      "value": 500
    },
    {
      "name": "Clientes",
      "value": 60
    },
  ];

  // Opções de personalização
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Categorias'; // Nome customizado do eixo X
  showYAxisLabel = true;
  yAxisLabel = 'Total de Registros'; // Nome customizado do eixo Y

  // Customização da formatação dos números do eixo Y
  yAxisTickFormatting = (value: number) => {
    // Aqui você pode definir os valores customizados que aparecerão no gráfico
   
    if (value === 2000000) return 60;
    if (value === 4000000) return 200;
    if (value === 6000000) return 500;
    if (value === 8000000) return 1000;
    return value;
  };

  // Controlar o valor máximo do eixo Y para ajustar o gráfico ao novo intervalo
  yScaleMax = 1000; // Altere para o valor máximo desejado

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
