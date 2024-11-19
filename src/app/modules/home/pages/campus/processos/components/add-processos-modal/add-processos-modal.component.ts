import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";

@Component({
  selector: 'app-add-process-modal',
  standalone: true,
  imports: [InputDefaultComponent, ButtonComponent, CommonModule, ReactiveFormsModule, SelectInputComponent],
  templateUrl: './add-processos-modal.component.html',
  styleUrls: ['./add-processos-modal.scss']
})
export class AddprocessosModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  form: FormGroup;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      numeroProtocolo: ['', Validators.required],
      entradaDoProtocolo: ['', Validators.required],
      documentosPendentes: [''],
      periciaMedica: ['', Validators.required],
      enderecoPericiaMedica: [''],
      avaliacaoSocial: ['', Validators.required],
      enderecoAvaliacaoSocial: [''],
      dataConcessao: ['', Validators.required],
      cessacao: ['', Validators.required]
    });
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    if (this.form.valid) {
      console.log('Form data:', this.form.value); // Exibe os valores do formulário
      // Handle form submission logic
    } else {
      console.error('Formulário inválido!');
    }
  }
}
