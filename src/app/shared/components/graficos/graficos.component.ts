import { Component, OnInit, OnDestroy, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { GraficosService } from '@modules/home/pages/initial-page/services/initial.service';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { SelectInputComponent } from '../inputs/select-input/select-input.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { modalPostComponent } from './components/modal-post/modal-post.components';
import { RelatoriosService } from '@core/services/relatorios.service';

export interface IDados {
  name: string,
  value: number,
}

interface IEstatisticaMes {
  id: number
  ano: number
  mes: string
  totalBeneficiosAguardando: number
  totalBeneficiosConcedidos: number
  totalContratos: number
  dadoEntrada: number
}

interface IDadosResponse {
  content: IEstatisticaMes[];
}

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule, modalPostComponent],
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent implements OnInit, OnDestroy {

  @ViewChild("modalPost") modalPost!: TemplateRef<any>;

  view: [number, number] = [1200, 600]; // Largura e altura maiores para desktop

  datagrafico: IDados[] = [];
  yScaleMax: number = 200;
  meses: string[] = [];
  mesSelecionado: string = '';
  itemSelectionado?: IEstatisticaMes;
  dadosContent: any[] = [];
  intervalId: any;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Categorias';
  showYAxisLabel = true;
  yAxisLabel = 'Quantidade';

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  bsModalRef?: BsModalRef;

  relatoriosOptionsIntervalo = [
    { label: "Pericia de avaliação social", value: "pericia-avaliacao-social"},
    { label: "Relação de contratos", value: "relacao-contratos" },
    { label: "Concessões", value: "concessoes" }
  ]

  relatoriosOptionsMes = [
    { label: "Relação de contratos(mês)", value: "relacao-contratos-do-mes" },
    { label: "Concessões(mês)", value: "concessoes-do-mes" },
    { label: "Perícia e avaliação social(mês)", value: "pericia-avaliacao-social-do-mes" },
  ]

   beneficiosOptions = [
    { value: "BPC_LOAS__DEFICIENTE", label: "BPC/LOAS ao Deficiente" },
    { value: "BPC_LOAS__IDOSO", label: "BPC/LOAS ao Idoso" },
    { value: "APOSENTADORIA_IDADE", label: "Aposentadoria por Idade" },
    {
      value: "APOSENTADORIA_TEMPO_CONTRIBUICAO",
      label: "Aposentadoria por Tempo de Contribuição",
    },
    { value: "APOSENTADORIA_INVALIDEZ", label: "Aposentadoria por Invalidez" },
    { value: "PENSAO_MORTE", label: "Pensão por Morte" },
    { value: "AUXILIO_RECLUSAO", label: "Auxílio Reclusão" },
    {
      value: "AUXILIO_INCAPACIDADE_TEMPORARIA",
      label: "Auxílio por Incapacidade Temporária",
    },
    { value: "AUXILIO_ACIDENTE", label: "Auxílio Acidente" },
    { value: "SALARIO_MATERNIDADE", label: "Salário Maternidade" },
  ];

  constructor(private readonly initialService: GraficosService, private modalService: BsModalService, private relatoriosService: RelatoriosService) {}

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
    const width = window.innerWidth < 980 ? window.innerWidth * 0.9 : 1200;
    const height = window.innerWidth < 980 ? window.innerHeight * 0.5 : 600;
    this.view = [width, height];
    this.showLegend = window.innerWidth >= 980;
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
    this.itemSelectionado = item;
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
          name: 'Dado Entrada',
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

  openModal(item: any): void {
    console.log("item saindo do componente contrato:", item);
    const initialState = {
      title: "Selecione o intervalo",
      formTemplate: this.modalPost,
      relatorioItem: item,
    };
    this.bsModalRef = this.modalService.show(modalPostComponent, {
      initialState,
    });
  }

  onDownloadRelatorioMes(item: any): void {
    console.log()

    this.relatoriosService.downloadRelatorioMes(item.value, `${this.itemSelectionado?.id}`);
  }

  generateAnoMes(): string {
    const now = new Date();
    const year = now.getFullYear(); // Ano atual
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mês atual com dois dígitos
    return `${year}${month}`;
  }
}
