import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "@shared/components/button/button.component";
import { ContratosService } from "../../services/contratos.service";
import Swal from "sweetalert2";

interface IContratoData {
  nome: string;
  cpf: string;
  status: string;
  beneficio: string;
  inicio: string;
  conclusao: string;
}

@Component({
  selector: "app-edit-contrato-modal",
  standalone: true,
  imports: [
    InputDefaultComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./edit-contrato-modal.component.html",
  styleUrls: ["./edit-contrato-modal.component.scss"],
})
export class EditContratoModalComponent implements OnInit {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  protected bsModalRef = inject(BsModalRef);
  private contratoService = inject(ContratosService);

  @Output() closeModal = new EventEmitter<void>();
  @Input() title!: string;
  @Input() contratoData!: any;
  isLoading = false;

  form: FormGroup = this.formBuilder.group({
    Id: [""],
    Inicio: [""],
    Conclusao: [""],
    Indicacao: [""],
    Valor: [0],
  });

  ngOnInit(): void {
    console.log(this.contratoData, "oi");
    if (this.contratoData) {
      this.form.patchValue(this.contratoData);
    }
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    const formValue = this.form.value;
    console.log("entrou assim", formValue);

    const result = {
      id: formValue.Id ? formValue.Id : null,
      inicio: this.transformToISODate(formValue.Inicio)
        ? this.transformToISODate(formValue.Inicio)
        : "",
      conclusao: this.transformToISODate(formValue.Conclusao)
        ? this.transformToISODate(formValue.Conclusao)
        : "",
      indicacao: formValue.Indicacao ? formValue.Indicacao : "",
      valor: formValue.Valor ? formValue.Valor : "",
    };
    console.log(result, "resultado");
    this.contratoService.editContrato(result).subscribe({
      next: (res) => {
        console.log("deu certo", res);
        this.contratoService.getContratos();
        this.onCloseModal();
      },
      error: (err) => {
        console.log(err);
        const { error } = err;
        Swal.fire({
          icon: "error",
          title: error.title || "error",
          text: error.detail || "Ocorreu um erro ao editar contrato.",
        });
      },
    });
  }

  transformToISODate(date: string): string {
    if (!date) return ""; // Retorna vazio se o valor for nulo ou indefinido

    const [day, month, year] = date.split("/"); // Divide a data com base nas barras "/"

    // Retorna a data no formato ISO "yyyy-mm-dd"
    return `${year}-${month}-${day}`;
  }
}
