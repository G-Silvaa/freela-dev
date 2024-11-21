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
import { DataInputComponent } from "@shared/components/inputs/data-input/data-input.component";

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
    DataInputComponent,
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
    if (this.contratoData) {
      const transformedData = {
        Id: this.contratoData.Id,
        Inicio: this.euaDateFormat(this.contratoData.Inicio),
        Conclusao: this.contratoData.Conclusao
          ? this.euaDateFormat(this.contratoData.Conclusao)
          : "",
        Indicacao: this.contratoData.Indicacao,
        Valor: this.contratoData.Valor,
      };
      this.form.patchValue(transformedData);
    }
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    const formValue = this.form.value;

    const result = {
      id: formValue.Id ? formValue.Id : null,
      inicio: formValue.Inicio ? formValue.Inicio : "",
      conclusao: formValue.Conclusao ? formValue.Conclusao : "",
      indicacao: formValue.Indicacao ? formValue.Indicacao : "",
      valor: formValue.Valor ? formValue.Valor : "",
    };
    this.contratoService.editContrato(result).subscribe({
      next: (res) => {
        this.contratoService.getContratos();
        this.onCloseModal();
      },
      error: (err) => {
        const { error } = err;
        Swal.fire({
          icon: "error",
          title: error.title || "error",
          text: error.detail || "Ocorreu um erro ao editar contrato.",
        });
      },
    });
  }

  euaDateFormat(data: string): string {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }
}
