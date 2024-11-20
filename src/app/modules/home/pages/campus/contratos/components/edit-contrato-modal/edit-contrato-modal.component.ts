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
    Nome: [""],
    Cpf: [""],
    Numero: [0],
    Beneficio: [""],
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

    const result = {
      id: formValue.Id,
      inicio: this.transformToISODate(formValue.Inicio),
      conclusao: this.transformToISODate(formValue.Conclusao),
      indicacao: formValue.Indicacao,
      valor: formValue.Valor,
    };
    this.contratoService.editContrato(result).subscribe({
      next: (res) => {
        console.log("deu certo", res);
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
