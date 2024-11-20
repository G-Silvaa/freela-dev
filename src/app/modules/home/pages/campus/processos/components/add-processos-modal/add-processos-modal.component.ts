import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ProcessosService } from '../../services/processos.service'; // Importe o serviço correto
import Swal from 'sweetalert2';
import { DataInputComponent } from "../../../../../../../shared/components/inputs/data-input/data-input.component";

@Component({
  selector: 'app-add-process-modal',
  standalone: true,
  imports: [InputDefaultComponent, ButtonComponent, CommonModule, ReactiveFormsModule, SelectInputComponent, DataInputComponent],
  templateUrl: './add-processos-modal.component.html',
  styleUrls: ['./add-processos-modal.scss']
})
export class AddprocessosModalComponent implements OnInit {
  @Input() processoId!: number; 
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  form: FormGroup;

  constructor(private modalService: BsModalService, private fb: FormBuilder, private processosService: ProcessosService, public bsModalRef: BsModalRef) {
    this.form = this.fb.group({
      status: [''],
      numeroProtocolo: [''],
      entradaDoProtocolo: [''],
      documentosPendentes: [''],
      periciaMedica: [''],
      enderecoPericiaMedica: [''],
      avaliacaoSocial: [''],
      enderecoAvaliacaoSocial: [''],
      dataConcessao: [''],
      cessacao: ['']
    });
  }

  ngOnInit() {
    if (this.processoId) {
      this.loadProcesso();
    }
  }

  loadProcesso() {
    this.isLoading = true;
    this.processosService.buscarProcessoPorId(this.processoId).subscribe(
      (processo) => {
        console.log('Processo carregado:', processo);
        this.form.patchValue(processo);
        this.isLoading = false;
      },
      (err) => {
        console.error('Erro ao carregar processo:', err);
        this.isLoading = false;
      }
    );
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    if (this.form.valid) {
      this.isLoading = true;
      const payload = this.createPayloadWithNulls(this.form.value);
      console.log('payload', payload);
      this.processosService.associarProcesso(this.processoId, payload).subscribe(
        (response) => {
          console.log('Processo atualizado com sucesso:', response);
          this.isLoading = false;
          this.onCloseModal();
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Processo atualizado com sucesso!',
          });
        },
        (err) => {
          this.isLoading = false;
          console.log('Erro ao atualizar o processo:', err);
          const errorMessage = err.error.detail || 'Ocorreu um erro ao atualizar o processo.';
          const titleMessage = err.error.title || 'Ocorreu um erro ao atualizar o processo.';
          Swal.fire({
            icon: 'error',
            title: titleMessage,
            text: errorMessage,
          });
        }
      );
    } else {
      console.error('Formulário inválido!');
    }
  }

  createPayloadWithNulls(formValue: any): any {
    const payload: any = {};
    for (const key in formValue) {
      if (formValue.hasOwnProperty(key)) {
        payload[key] = formValue[key] === '' ? null : formValue[key];
      }
    }
    payload.cessacaoLabel = 'Cessação';
    return payload;
  }
}