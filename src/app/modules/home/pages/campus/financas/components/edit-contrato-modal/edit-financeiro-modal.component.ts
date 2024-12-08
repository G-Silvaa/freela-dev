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
import { FinancasService } from "../../services/contratos.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-financeiro-modal",
  standalone: true,
  imports: [
    InputDefaultComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./edit-financeiro-modal.component.html",
  styleUrls: ["./edit-financeiro-modal.component.scss"],
})
export class EditFinanceiroModalComponent implements OnInit {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);
  protected bsModalRef = inject(BsModalRef);
  private financasService = inject(FinancasService);

  @Output() closeModal = new EventEmitter<void>();
  @Input() title!: string;
  @Input() financeiroData!: any;
  isLoading = false;

  form: FormGroup = this.formBuilder.group({
    parcelasRestantes: ["", Validators.required],
    valorProximaParcela: ["", Validators.required],
  });

  ngOnInit(): void {
    if (this.financeiroData) {
      const transformedData = {
        parcelasRestantes: this.financeiroData["Parcelas restantes"],
        valorProximaParcela: this.financeiroData["Próxima parcela"],
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
      parcelasRestantes: formValue.parcelasRestantes,
      valorProximaParcela: formValue.valorProximaParcela,
    };
    this.financasService.updateFinanceiro(this.financeiroData.Id, result).subscribe({
      next: (res) => {
        this.financasService.getFinancas();
        this.onCloseModal();
      },
      error: (err) => {
        const { error } = err;
        Swal.fire({
          icon: "error",
          title: error.title || "error",
          text: error.detail || "Ocorreu um erro ao editar financeiro.",
        });
      },
    });
  }
}