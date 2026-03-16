import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "@shared/components/inputs/select-input/select-input.component";
import { TableComponent } from "@shared/components/table/table.component";
import { FinancasService } from "./services/contratos.service";
import { beneficiosOptions } from "@core/consts/benenficios.const";
import { EditFinanceiroModalComponent } from "./components/edit-contrato-modal/edit-financeiro-modal.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-financas",
  standalone: true,
  imports: [
    TableComponent,
    InputDefaultComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    EditFinanceiroModalComponent,
  ],
  providers: [DatePipe],
  templateUrl: "./financas.component.html",
  styleUrls: ["./financas.component.scss"],
})
export class FinancasComponent implements OnInit {
  pessoasFinanceiro = <any>[];
  beneficiosOptions = beneficiosOptions;
  isLoading = false;
  bsModalRef?: BsModalRef;
  private financasService = inject(FinancasService);
  private datePipe = inject(DatePipe);
  protected formBuilder = inject(FormBuilder);

  protected filterForm = this.formBuilder.group({
    nome: [""],
    cpf: [""],
    beneficio: [""],
    situacaoParcela: [""],
    situacaoPagamento: [""],
  });

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.financasService.financas$().subscribe((res) => {
      this.pessoasFinanceiro = this.dataTransform(res);
      this.isLoading = false;
    });

    this.financasService.getFinancas();
  }

  get totalFinanceiros(): number {
    return this.pessoasFinanceiro.length;
  }

  get totalPagos(): number {
    return this.pessoasFinanceiro.filter((item: any) => item.__quitado).length;
  }

  get totalPendentes(): number {
    return this.pessoasFinanceiro.filter((item: any) => !item.__quitado).length;
  }

  get proximaReceita(): string {
    const total = this.pessoasFinanceiro.reduce(
      (acc: number, item: any) => acc + (item.__proximaParcela ?? 0),
      0,
    );

    return this.formatCurrency(total);
  }

  submitFilter() {
    const formValue = this.filterForm.value;

    if (!formValue.nome && !formValue.cpf && !formValue.beneficio && !formValue.situacaoParcela && formValue.situacaoPagamento === "") {
      this.isLoading = true;
      this.financasService.getFinancas();
      return;
    }

    const filteredCpfForm = {
      nome: formValue.nome,
      cpf: formValue.cpf ? this.removeSpecialCharacters(formValue.cpf) : "",
      beneficio: formValue.beneficio,
      situacaoParcela: formValue.situacaoParcela,
      situacaoPagamento: formValue.situacaoPagamento,
    };

    this.isLoading = true;
    this.financasService.filterFinancas(filteredCpfForm).subscribe({
      next: (res) => {
        const { content } = res;
        this.pessoasFinanceiro = content.length ? this.dataTransform(content) : [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire("Erro", "Não foi possível aplicar os filtros financeiros.", "error");
      },
    });
  }

  clearFilter() {
    this.filterForm.reset({
      nome: "",
      cpf: "",
      beneficio: "",
      situacaoParcela: "",
      situacaoPagamento: "",
    });
    this.isLoading = true;
    this.financasService.getFinancas();
  }

  onEdit(item: any) {
    const initialState = {
      title: "Editar Financeiro",
      financeiroData: item,
    };
    this.bsModalRef = this.modalService.show(EditFinanceiroModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = "Close";
  }

  onGenerateBoleto(item: any) {
    this.financasService.generateBoleto(item.id).subscribe({
      next: (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].trim()
          : 'boleto.pdf';

        if (response.body) {
          const blob = new Blob([response.body as Blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
      error: (error) => {
        console.error('Erro ao gerar o boleto', error);
      },
    });
  }

  onDownloadComprovante(item: any) {
    this.financasService.downloadComprovante(item.id).subscribe({
      next: (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].trim()
          : 'comprovante.pdf';

        if (response.body) {
          const blob = new Blob([response.body as Blob], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
      error: (error) => {
        console.error('Erro ao baixar o comprovante', error);
      },
    });
  }

  dataTransform(data: any[]) {
    return data.map((item: any) => {
      const dataPagamentoParcelaTransformed = this.datePipe.transform(
        item.dataPagamentoParcela,
        "dd/MM/yyyy",
      );

      return {
        Id: item.id,
        __quitado: !!item.situacaoPagamento,
        __valorTotal: Number(item.valorTotalPagar ?? 0),
        __proximaParcela: Number(item.valorProximaParcela ?? 0),
        Nome: item.contrato.cliente.contato.nome,
        CPF: this.addSpecialCharacters(item.contrato.cliente.cpf),
        'Benefício': item.contrato.beneficio,
        "Valor total à pagar": this.formatCurrency(item.valorTotalPagar ?? 0),
        "Montante pago": this.formatCurrency(item.montantePago ?? 0),
        "Próxima parcela": this.formatCurrency(item.valorProximaParcela ?? 0),
        "Parcelas restantes": item.parcelasRestantes,
        "Situação parcela": item.situacaoParcela,
        "Situação pagamento": item.situacaoPagamento ? "Pago" : "Aguardando Pagamento",
        "Data pagamento da parcela": dataPagamentoParcelaTransformed ? dataPagamentoParcelaTransformed : "",
      };
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 2,
    }).format(value);
  }

  removeSpecialCharacters(input: string): string {
    return input.replace(/[.-]/g, "");
  }

  addSpecialCharacters(cpf: string): string {
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
  }
}
