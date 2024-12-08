import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "@shared/components/inputs/select-input/select-input.component";
import { TableComponent } from "@shared/components/table/table.component";
import { FinancasService } from "./services/contratos.service";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { beneficiosOptions } from "@core/consts/benenficios.const";
import Swal from "sweetalert2";

@Component({
  selector: "app-financas",
  standalone: true,
  imports: [
    TableComponent,
    InputDefaultComponent,
    SelectInputComponent,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: "./financas.component.html",
  styleUrl: "./financas.component.scss",
})
export class FinancasComponent implements OnInit {
  pessoasFinanceiro = <any>[];
  beneficiosOptions = beneficiosOptions;
  isLoading = false;
  protected lastfilter = {};
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

  constructor() {}

  ngOnInit(): void {
    this.financasService.financas$().subscribe((res) => {
      console.log("res", res);
      this.pessoasFinanceiro = this.dataTransform(res);

    });

    this.financasService.getFinancas();

    console.log("pessoasFinanceiro", this.dataTransform);
  }

  submitFilter() {
    const formValue = this.filterForm.value;
    if(this.lastfilter === formValue) {
      return;
    }
    if (!formValue.nome && !formValue.cpf && !formValue.beneficio && !formValue.situacaoParcela && formValue.situacaoPagamento === "" && (this.lastfilter === formValue)) {
      return;
    }
    const filteredCpfForm = {
      nome: formValue.nome,
      cpf: formValue.cpf ? this.removeSpecialCharacters(formValue.cpf) : "",
      beneficio: formValue.beneficio,
      situacaoParcela: formValue.situacaoParcela,
      situacaoPagamento: formValue.situacaoPagamento,
    };

    this.financasService.filterFinancas(filteredCpfForm).subscribe({
      next: (res) => {
        const { content } = res;
        if (content.length) {
          this.pessoasFinanceiro = this.dataTransform(content);
        } else {
          this.pessoasFinanceiro = [];
        }
      },
      error: (err) => {
        console.log("erro", err);
      },
    });
    this.lastfilter = formValue;
  }

  clearFilter() {
    if(this.filterForm.value.nome || this.filterForm.value.cpf || this.filterForm.value.beneficio || this.filterForm.value.situacaoParcela || this.filterForm.value.situacaoPagamento !== "") {
      this.filterForm.reset();
      this.submitFilter();
    }
  }

  dataTransform(data: any[]) {
    return data.map((item: any) => {
      const dataPagamentoParcelaTransformed = this.datePipe.transform(
        item.dataPagamentoParcela,
        "dd/MM/yyyy",
      );

      const dataTransformed = {
        Nome: item.contrato.cliente.contato.nome,
        CPF: this.addSpecialCharacters(item.contrato.cliente.cpf),
        'Benefício': item.contrato.beneficio,
        "Valor total à pagar": item.valorTotalPagar,
        "Número solicitação pagamento": item.numeroSolicitacaoPagamento,
        "Montante pago": item.montantePago,
        "Próxima parcela": item.valorProximaParcela,
        "Valor pago da parcela": item.valorPagoDaParcela,
        "Data pagamento da parcela": dataPagamentoParcelaTransformed ? dataPagamentoParcelaTransformed : "",
        "Parcelas restantes": item.parcelasRestantes,
        "Parcelas pagas": item.parcelasPagas,
        "Situação parcela": item.situacaoParcela,
        "Situação pagamento": item.situacaoPagamento ? "Pago" : "Aguardando Pagamento",
      };
      console.log("pessoasFinanceiro", dataTransformed);
      return dataTransformed;
      
    });

   
  }

  removeSpecialCharacters(input: string): string {
    return input.replace(/[.-]/g, "");
  }

  addSpecialCharacters(cpf: string): string {
    // Formata o CPF usando substrings
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
  }
}