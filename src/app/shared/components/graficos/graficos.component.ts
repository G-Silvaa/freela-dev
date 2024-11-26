import { Component, OnInit } from '@angular/core';
import { GraficosService } from '@modules/home/pages/initial-page/services/initial.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit {
  view: [number, number] = [700, 400]; // Tamanho do gráfico


  ngOnInit(): void {
    this.getdads();
  }
  
  constructor(private readonly initialService: GraficosService) {}
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

  getdads(): void {
    this.initialService.getDados().subscribe((data) => {
      console.log(data);
    });
  }
 
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Categorias'; 
  showYAxisLabel = true;
  yAxisLabel = 'Total de Registros';

  yAxisTickFormatting = (value: number) => {
    
   
    if (value === 2000000) return 60;
    if (value === 4000000) return 200;
    if (value === 6000000) return 500;
    if (value === 8000000) return 1000;
    return value;
  };

  
  yScaleMax = 1000; 

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
