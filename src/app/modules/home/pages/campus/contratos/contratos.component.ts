import {
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import Swal from "sweetalert2";

import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "@shared/components/inputs/select-input/select-input.component";
import { TableComponent } from "@shared/components/table/table.component";
import { EditContratoModalComponent } from "./components/edit-contrato-modal/edit-contrato-modal.component";
import { ContratosService } from "./services/contratos.service";
import { beneficiosOptions } from "@core/consts/benenficios.const";
import { AuthService } from "@core/services/auth/auth.service";

@Component({
  selector: "app-grupo-de-acesso",
  standalone: true,
  imports: [
    TableComponent,
    InputDefaultComponent,
    SelectInputComponent,
    EditContratoModalComponent,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
  templateUrl: "./contratos.component.html",
  styleUrl: "./contratos.component.scss",
})
export class ContratosComponent implements OnInit {
  pessoasContrato = <any>[];
  beneficiosOptions = beneficiosOptions;
  isLoading = false;
  bsModalRef?: BsModalRef;
  private contratosService = inject(ContratosService);
  private datePipe = inject(DatePipe);
  protected formBuilder = inject(FormBuilder);

  protected filterForm = this.formBuilder.group({
    nome: [""],
    cpf: [""],
    beneficio: [""],
  });

  constructor(private modalService: BsModalService) {}
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.isLoading = true;
    this.contratosService.contratos$().subscribe((res) => {
      this.pessoasContrato = this.dataTransform(res);
      this.isLoading = false;
    });

    this.contratosService.getContratos();
  }

  get totalContratos(): number {
    return this.pessoasContrato.length;
  }

  get contratosAtivos(): number {
    return this.pessoasContrato.filter((item: any) => item.__ativo).length;
  }

  get contratosEncerrados(): number {
    return this.pessoasContrato.filter((item: any) => !item.__ativo).length;
  }

  get valorTotal(): string {
    const total = this.pessoasContrato.reduce(
      (acc: number, item: any) => acc + (item.__valor ?? 0),
      0,
    );

    return this.formatCurrency(total);
  }

  get canManageContratos(): boolean {
    return this.authService.canManageContratos();
  }

  get canRenewContratos(): boolean {
    return this.authService.canRenewContratos();
  }

  get canDownloadContratos(): boolean {
    return this.authService.canDownloadContratos();
  }

  get contratosTableDescription(): string {
    if (this.canManageContratos) {
      return 'Edição, exclusão, renovação e emissão do contrato direto da tabela.';
    }

    if (this.canDownloadContratos) {
      return 'Consulta da carteira contratual com emissão de documentos disponíveis.';
    }

    return 'Consulta da carteira contratual em modo leitura.';
  }

  submitFilter() {
    const formValue = this.filterForm.value;

    if (!formValue.nome && !formValue.cpf && !formValue.beneficio) {
      this.isLoading = true;
      this.contratosService.getContratos();
      return;
    }

    const filteredCpfForm = {
      nome: formValue.nome,
      cpf: formValue.cpf ? this.removeSpecialCharacters(formValue.cpf) : "",
      beneficio: formValue.beneficio,
    };

    this.isLoading = true;
    this.contratosService.filterContratos(filteredCpfForm).subscribe({
      next: (res) => {
        const { content } = res;
        this.pessoasContrato = content.length ? this.dataTransform(content) : [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire("Erro", "Não foi possível aplicar os filtros de contrato.", "error");
      },
    });
  }

  clearFilter() {
    this.filterForm.reset({
      nome: "",
      cpf: "",
      beneficio: "",
    });
    this.isLoading = true;
    this.contratosService.getContratos();
  }

  onEdit(item: any) {
    const initialState = {
      title: "Editar contrato",
      contratoData: item,
    };
    this.bsModalRef = this.modalService.show(EditContratoModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = "Close";
  }

  onDelete(item: any) {
    Swal.fire({
      title: "Aviso!",
      text: "Deseja mesmo deletar este contrato? Esta ação é irreversível.",
      icon: "warning",
      confirmButtonColor: "#112641",
      confirmButtonText: "Excluir",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((resultado) => {
      if (!resultado.dismiss) {
        this.contratosService.deleteContrato(item.Id);
      }
    });
  }

  dataTransform(data: any[]) {
    return data.map((item: any) => {
      const beginningDateTransformed = this.datePipe.transform(
        item.inicio,
        "dd/MM/yyyy",
      );

      const conclusionDateTransformed = this.datePipe.transform(
        item.conclusao,
        "dd/MM/yyyy",
      );

      return {
        Id: item.id,
        __ativo: !item.conclusao,
        __valor: Number(item.valor ?? 0),
        Nome: item.cliente.contato.nome,
        CPF: this.addSpecialCharacters(item.cliente.cpf),
        'Benefício': item.beneficio,
        'Número': item.numero,
        'Início': beginningDateTransformed ? beginningDateTransformed : "",
        'Conclusão': conclusionDateTransformed ? conclusionDateTransformed : "",
        Valor: this.formatCurrency(item.valor ?? 0),
      };
    });
  }

  onEmitDownloadContract(item: { id: any }) {
    this.contratosService.downloadAndSaveFile(item.id);
  }

  onEmitRenewContractId(item: { id: any }) {
    Swal.fire({
      title: "Cuidado!",
      text: "Tem certeza que deseja renovar este contrato?",
      icon: "warning",
      confirmButtonColor: "#112641",
      confirmButtonText: "Renovar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((resultado: any) => {
      if (!resultado.dismiss) {
        this.contratosService.renewContract(item.id);
      }
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
