import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core"; // Importar TemplateRef e ViewChild
import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "@shared/components/inputs/select-input/select-input.component";
import { ModalComponent } from "@shared/components/modal/modal.component";
import { TableComponent } from "@shared/components/table/table.component";
import { AddUsersModalComponent } from "../clientes/components/add-users-modal/add-users-modal.component";
import { ButtonComponent } from "@shared/components/button/button.component";
import {
  adicionarPessoasData,
  pessoasContrato,
  primeiroFiltro,
  segundoFiltro,
  terceiroFiltro,
} from "../clientes/data/data";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { EditContratoModalComponent } from "./components/edit-contrato-modal/edit-contrato-modal.component";
import { ContratosService } from "./services/contratos.service";
import { DatePipe } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { beneficiosOptions } from "@core/consts/benenficios.const";
import Swal from "sweetalert2";

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
  cadatrarUsuario = true;
  pessoasContrato = <any>[];
  adicionarPessoasData = adicionarPessoasData;
  primeiroFiltro = primeiroFiltro;
  segundoFiltro = segundoFiltro;
  terceiroFiltro = terceiroFiltro;
  beneficiosOptions = beneficiosOptions;
  isLoading = false;
  protected lastfilter = {};
  bsModalRef?: BsModalRef;

  @ViewChild("editTemplate") editTemplate!: TemplateRef<any>;
  private contratosService = inject(ContratosService);
  private datePipe = inject(DatePipe);
  protected formBuilder = inject(FormBuilder);

  protected filterForm = this.formBuilder.group({
    nome: [""],
    cpf: [""],
    beneficio: [""],
  });

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.contratosService.contratos$().subscribe((res) => {
      this.pessoasContrato = this.dataTransform(res);
    });

    this.contratosService.getContratos();
  }

  submitFilter() {
    const formValue = this.filterForm.value;
    if(this.lastfilter === formValue) {
      return;
    }
    if (!formValue.nome && !formValue.cpf && !formValue.beneficio && (this.lastfilter === formValue)) {
      return;
    }
    const filteredCpfForm = {
      nome: formValue.nome,
      cpf: formValue.cpf ? this.removeSpecialCharacters(formValue.cpf) : "",
      beneficio: formValue.beneficio,
    };

    this.contratosService.filterContratos(filteredCpfForm).subscribe({
      next: (res) => {
        const { content } = res;
        if (content.length) {
          this.pessoasContrato = this.dataTransform(content);
        } else {
          this.pessoasContrato = [];
        }
      },
      error: (err) => {
        console.log("erro", err);
      },
    });
    this.lastfilter = formValue;
  }

  clearFilter() {
    if(this.filterForm.value.nome || this.filterForm.value.cpf || this.filterForm.value.beneficio) {
      this.filterForm.reset();
      this.submitFilter();
    }
  }

  onEdit(item: any) {
    console.log("item saindo do componente contrato:", item);
    const initialState = {
      title: "Editar contrato",
      formTemplate: this.editTemplate,
      contratoData: item,
    };
    this.bsModalRef = this.modalService.show(EditContratoModalComponent, {
      initialState,
    });
    this.bsModalRef.content.closeBtnName = "Close";
  }

  onDelete(item: any) {
    console.log("Delete item:", item);
    Swal.fire({
      title: "Aviso!",
      text: `Deseja mesmo deletar este contrato? Esta ação é irreversível.`,
      icon: "warning",
      confirmButtonColor: "#2F9E41",
      confirmButtonText: "Substituir",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    }).then((resultado) => {
      if (!resultado.dismiss) {
        this.contratosService.deleteContrato(item.Id);
      }
    });

  }

  back() {
    this.cadatrarUsuario = true;
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

      const dataTransformed = {
        Id: item.id,
        Nome: item.cliente.contato.nome,
        Cpf: this.addSpecialCharacters(item.cliente.cpf),
        Beneficio: item.beneficio,
        Numero: item.numero,
        Inicio: beginningDateTransformed ? beginningDateTransformed : "",
        Conclusao: conclusionDateTransformed ? conclusionDateTransformed : "",
        Indicacao: item.indicacao ? item.indicacao : "",
        Valor: item.valor ? item.valor : 0,
      };
      return dataTransformed;
    });
  }

  onEmitDownloadContract(item: { id: any }) {
    this.contratosService.downloadAndSaveFile(item.id);
    console.log("Download contrato", item);
  }

  onEmitRenewContractId(item: { id: any }) {
    Swal.fire({
      title: "Cuidado!",
      text: `Tem certeza que deseja renovar este contrato?`,
      icon: "warning",
      confirmButtonColor: "#2F9E41",
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

  removeSpecialCharacters(input: string): string {
    return input.replace(/[.-]/g, "");
  }

  addSpecialCharacters(cpf: string): string {
    // Formata o CPF usando substrings
    return `${cpf.substring(0, 3)}.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-${cpf.substring(9)}`;
  }
}
