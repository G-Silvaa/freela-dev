import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ProcessosService } from '../../services/processos.service'; // Importe o serviço correto
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-process-modal',
  standalone: true,
  imports: [InputDefaultComponent, ButtonComponent, CommonModule, ReactiveFormsModule, SelectInputComponent],
  templateUrl: './add-processos-modal.component.html',
  styleUrls: ['./add-processos-modal.scss']
})
export class AddprocessosModalComponent implements OnInit {
  @Input() processoId!: number; 
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  form: FormGroup;

  constructor(private modalService: BsModalService, private fb: FormBuilder, private processosService: ProcessosService,  public bsModalRef: BsModalRef,) {
    this.form = this.fb.group({
      status: ['',],
      numeroProtocolo: ['', ],
      entradaDoProtocolo: ['', ],
      documentosPendentes: [''],
      periciaMedica: ['', ],
      enderecoPericiaMedica: [''],
      avaliacaoSocial: ['', ],
      enderecoAvaliacaoSocial: [''],
      dataConcessao: ['', ],
      cessacao: ['', ]
    });
  }

  ngOnInit() {
    console.log('teste', this.processoId);
    this.processoId
  }

  onCloseModal() {
    this.modalService.hide();
  }

  onSave() {
    if (this.form.valid) {
      this.isLoading = true;
      const payload = {
        ...this.form.value,
        statusLabel: this.getStatusLabel(this.form.value.status),
        cessacaoLabel: 'Cessação'
      };
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
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: errorMessage,
          });
        }
      );
    } else {
      console.error('Formulário inválido!');
    }
  }

  getStatusLabel(status: string): string {
    const statusOptions = [
      { value: '1', label: 'Pendente' },
      { value: '2', label: 'Análise' },
      { value: '3', label: 'Cumprimento com Exigencia' },
      { value: '4', label: 'Analise Administrativa' },
      { value: '5', label: 'Aprovado' },
      { value: '6', label: 'Reprovado' }
    ];
    const selectedStatus = statusOptions.find(option => option.value === status);
    return selectedStatus ? selectedStatus.label : '';
  }
}