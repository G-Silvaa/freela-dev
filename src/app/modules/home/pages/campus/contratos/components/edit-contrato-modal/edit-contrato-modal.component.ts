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

  @Output() closeModal = new EventEmitter<void>();
  @Input() title!: string;
  @Input() contratoData!: any;
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
