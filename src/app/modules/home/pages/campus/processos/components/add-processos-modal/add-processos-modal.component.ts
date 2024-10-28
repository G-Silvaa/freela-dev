import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-process-modal',
  standalone: true,
  imports: [InputDefaultComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
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
      periciaMedica: ['', Validators.required],
      avaliacaoSocial: ['', Validators.required],
      entradaProtocolo: ['', Validators.required]
    });
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