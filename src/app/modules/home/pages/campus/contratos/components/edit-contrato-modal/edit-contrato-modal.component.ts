import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { CommonModule } from "@angular/common";
import { InputDefaultComponent } from "@shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "@shared/components/button/button.component";

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
export class EditContratoModalComponent {
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);

  @Output() closeModal = new EventEmitter<void>();
  @Input() contratoData?: IContratoData;
  isLoading = false;

  form: FormGroup = this.formBuilder.group({
    nome: ["", Validators.required],
    cpf: ["", Validators.required],
    status: ["", Validators.required],
    beneficio: ["", Validators.required],
    inicio: ["", Validators.required],
    conclusao: ["", Validators.required],
  });

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    if (this.form.valid) {
      // Handle form submission
    }
  }
}
