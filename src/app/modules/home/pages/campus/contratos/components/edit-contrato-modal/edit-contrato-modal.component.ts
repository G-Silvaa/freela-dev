import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
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
export class EditContratoModalComponent implements OnInit{
  private modalService = inject(BsModalService);
  private formBuilder = inject(FormBuilder);

  @Output() closeModal = new EventEmitter<void>();
  @Input() contratoData?: IContratoData;
  isLoading = false;

  form: FormGroup = this.formBuilder.group({
    Nome: ["", Validators.required],
    Cpf: ["", Validators.required],
    Status: ["", Validators.required],
    Beneficio: ["", Validators.required],
    Inicio: ["", Validators.required],
    Conclusao: ["", Validators.required],
  });

  ngOnInit(): void {
    console.log(this.contratoData, "oi")
    if (this.contratoData) {
      this.form.patchValue(this.contratoData);
    }
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    if (this.form.valid) {
      // Handle form submission
    }
  }
}
