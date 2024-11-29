import { Component, OnInit } from '@angular/core';
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

  currentMonthIndex: number = 0;
  months: string[] = [];
  currentMonth: string = '';
  apiData: any;

  constructor(private readonly initialService: GraficosService) {}

  ngOnInit(): void {
    this.getdads();
  }

  getdads(): void {
    this.initialService.getDados().subscribe((data: IDadosResponse) => {
      console.log('Raw data from API:', data);

      if (data.content && Array.isArray(data.content) && data.content.length > 0) {
        this.apiData = data.content;
        this.months = data.content.map(item => item.mes);
        this.currentMonthIndex = 0;
        this.currentMonth = this.months[this.currentMonthIndex];
        this.updateChartData(this.apiData[this.currentMonthIndex]);
      }
    });
  }

  updateChartData(data: any): void {
    console.log('Data to update chart:', data);
    this.datagrafico = [
      { name: 'Benefícios Aguardando', value: this.ensureValidNumber(data.totalBeneficiosAguardando) },
      { name: 'Benefícios Concedidos', value: this.ensureValidNumber(data.totalBeneficiosConcedidos) },
      { name: 'Contratos', value: this.ensureValidNumber(data.totalContratos) },
      { name: 'Dados de Entrada', value: this.ensureValidNumber(data.dadoEntrada) }
    ];
  
    console.log('Dados do gráfico:', this.datagrafico);
  
    this.yScaleMax = Math.max(...this.datagrafico.map(d => d.value));
    console.log('yScaleMax:', this.yScaleMax);
  }

  ensureValidNumber(value: any): number {
    const validNumber = isNaN(value) || value < 0 ? 0 : value;
    console.log(`Ensuring valid number: ${value} -> ${validNumber}`);
    return validNumber;
  }

  previousMonth(): void {
    if (this.currentMonthIndex > 0) {
      this.currentMonthIndex--;
      this.currentMonth = this.months[this.currentMonthIndex];
      this.updateChartData(this.apiData[this.currentMonthIndex]);
    }
  }

  nextMonth(): void {
    if (this.currentMonthIndex < this.months.length - 1) {
      this.currentMonthIndex++;
      this.currentMonth = this.months[this.currentMonthIndex];
      this.updateChartData(this.apiData[this.currentMonthIndex]);
    }
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