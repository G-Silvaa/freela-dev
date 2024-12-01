import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { GraficosService } from '@modules/home/pages/initial-page/services/initial.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';

export interface IDados {
  name: string,
  value: number,
}

interface IDadosResponse {
  content: {
    ano: number;
    mes: string;
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
export class GraficosComponent implements OnInit, OnDestroy {
  view: [number, number] = [1200, 600]; // Largura e altura maiores para desktop

  datagrafico: IDados[] = [];
  yScaleMax: number = 200;
  meses: string[] = [];
  mesSelecionado: string = '';
  dadosContent: any[] = [];
  intervalId: any;

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
    this.updateChartSize();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateChartSize();
  }

  updateChartSize(): void {
    const width = window.innerWidth < 980 ? window.innerWidth * 0.9 : 1200; // Ajuste a largura com base no tamanho da janela
    const height = window.innerWidth < 980 ? window.innerHeight * 0.5 : 600; // Ajuste a altura com base no tamanho da janela
    this.view = [width, height];
    this.showLegend = window.innerWidth >= 980; // Mostrar legenda apenas se a largura for maior ou igual a 980px
  }

  getdads(): void {
    this.initialService.getDados().subscribe((data: IDadosResponse) => {
      console.log("esse aqui", data);

      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        this.dadosContent = data.content;
        this.meses = data.content.map(item => item.mes);
        this.mesSelecionado = this.meses[0];
        this.atualizarGrafico(this.mesSelecionado);
      }

      console.log('Dados do gráfico:', this.datagrafico);
      console.log('yScaleMax:', this.yScaleMax);
    });
  }

  atualizarGrafico(mes: string): void {
    const item = this.dadosContent.find(i => i.mes === mes);
    if (item) {
      this.datagrafico = [
        {
          name: 'Benefícios Aguardando',
          value: item.totalBeneficiosAguardando || 0,
        },
        {
          name: 'Benefícios Concedidos',
          value: item.totalBeneficiosConcedidos || 0,
        },
        {
          name: 'Contratos',
          value: item.totalContratos || 0,
        },
        {
          name: 'Dado de Entrada',
          value: item.dadoEntrada || 0,
        }
      ];

      // Calcular o valor máximo entre os valores de 'value'
      this.yScaleMax = Math.max(...this.datagrafico.map(d => d.value));
    }
  }

  onMesAnterior(): void {
    const index = this.meses.indexOf(this.mesSelecionado);
    if (index > 0) {
      this.mesSelecionado = this.meses[index - 1];
    } else {
      this.mesSelecionado = this.meses[this.meses.length - 1];
    }
    this.atualizarGrafico(this.mesSelecionado);
    console.log("esse é o mes selecionado: cliquei no anterior", this.mesSelecionado);
  }

  onMesProximo(): void {
    const index = this.meses.indexOf(this.mesSelecionado);
    if (index < this.meses.length - 1) {
      this.mesSelecionado = this.meses[index + 1];
    } else {
      this.mesSelecionado = this.meses[0];
    }
    this.atualizarGrafico(this.mesSelecionado);
    console.log("esse é o mes selecionado: cliquei no proximo", this.mesSelecionado);
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