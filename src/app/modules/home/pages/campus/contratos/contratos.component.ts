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

@Component({
  selector: "app-grupo-de-acesso",
  standalone: true,
  imports: [
    TableComponent,
    InputDefaultComponent,
    SelectInputComponent,
    ModalComponent,
    AddUsersModalComponent,
    ButtonComponent,
    EditContratoModalComponent,
  ],
  providers: [DatePipe],
  templateUrl: "./contratos.component.html",
  styleUrl: "./contratos.component.scss",
})
export class ContratosComponent implements OnInit {
  cadatrarUsuario = true;
  pessoasContrato = pessoasContrato;
  adicionarPessoasData = adicionarPessoasData;
  primeiroFiltro = primeiroFiltro;
  segundoFiltro = segundoFiltro;
  terceiroFiltro = terceiroFiltro;
  isLoading = false;
  bsModalRef?: BsModalRef;

  @ViewChild("editTemplate") editTemplate!: TemplateRef<any>;
  private contratosService = inject(ContratosService);
  private datePipe = inject(DatePipe);

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    this.contratosService.getContratos$().subscribe({
      next: (reponse) => {
        const { content } = reponse;
        this.pessoasContrato = this.dataTransform(content);
      },
      error: (error) => {
        console.error("Error:", error);
      },
    });
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
  }

  back() {
    this.cadatrarUsuario = true;
  }

  dataTransform(data: any[]) {
    const teste = this.datePipe.transform(data[0].inicio, "dd/MM/yyyy");
    console.log("transformado:", teste);

    return data.map((item: any) => {
      const dateTransformed = this.datePipe.transform(
        item.inicio,
        "dd/MM/yyyy",
      );

      const dataTransformed = {
        Nome: item.cliente.contato.nome,
        Cpf: item.cliente.cpf,
        Beneficio: "valor fixo",
        Status: "valor fixo",
        Inicio: dateTransformed ? dateTransformed : "valor fixo",
        Conclusao: item.conclusao ? item.conclusao : "valor fixo",
      };
      return dataTransformed;
    });
  }
}
