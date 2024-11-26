import { Component, OnInit } from '@angular/core';
import { GraficosService } from '@modules/home/pages/initial-page/services/initial.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

export interface IDados {
  name: string,
  value: number,
}

interface IDadosResponse {
  content: {
    totalBeneficiosAguardando: number;
    totalBeneficiosConcedidos: number;
    totalContratos: number;
    dadoEntrada: number; 
  }[];
}

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit {
  view: [number, number] = [700, 400]; 

  datagrafico: IDados[] = [];
  yScaleMax: number = 200;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Categorias'; 
  showYAxisLabel = true;
  yAxisLabel = 'Total de Registros';

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private readonly initialService: GraficosService) {}

  ngOnInit(): void {
    this.getdads();
  }

  getdads(): void {
    this.initialService.getDados().subscribe((data: IDadosResponse) => {
      console.log(data);

      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        this.datagrafico = data.content.map((item: any) => ({
          name: 'Benefícios Aguardando', 
          value: item.totalBeneficiosAguardando,
        }));

        this.datagrafico.push(
          {
            name: 'Benefícios Concedidos',
            value: data.content[0].totalBeneficiosConcedidos,
          },
          {
            name: 'Contratos',
            value: data.content[0].totalContratos,
          },
          {
            name: 'Dados de Entrada',
            value: data.content[0].dadoEntrada,
          }
        );

        // Calcular o valor máximo entre os valores de 'value'
        this.yScaleMax = Math.max(...this.datagrafico.map(d => d.value));
      }

      console.log('Dados do gráfico:', this.datagrafico);
      console.log('yScaleMax:', this.yScaleMax);
    });
  }

  yAxisTickFormatting = (value: number) => {
    if (value === 2000000) return 60;
    if (value === 4000000) return 200;
    if (value === 6000000) return 500;
    if (value === 8000000) return 1000;
    return value;
  };

  onSelect(event: any): void {
    console.log(event);
  }
}