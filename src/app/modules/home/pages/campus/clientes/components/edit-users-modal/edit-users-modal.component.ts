import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { CustomValidationService } from '../add-users-modal/utils/customvalidators';
import Swal from 'sweetalert2';
import { DataInputComponent } from "../../../../../../../shared/components/inputs/data-input/data-input.component";

@Component({
  selector: 'app-edit-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, ButtonComponent, CommonModule, ReactiveFormsModule, DataInputComponent],
  templateUrl: './edit-users-modal.component.html',
  styleUrls: ['./edit-users-modal.component.scss'],
  providers: [DatePipe]
})
export class EditUsersModalComponent implements OnInit {
  @Input() data: any;
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  currentStep = 1;
  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private clientesService: ClientesService,
    public bsModalRef: BsModalRef,
    private datePipe: DatePipe,
    private customValidationService: CustomValidationService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      complemento: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      temRepresentante: ['', Validators.required],
      representanteNome: [''],
      representanteEmail: [''],
      representanteTelefone: [''],
      parentesco: [''],
      representanteCpf: [''],
      representanteRg: [''],
      representanteDataNascimento: [''],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      const formattedDate = this.datePipe.transform(this.data.nascimento, 'ddMMyyyy');
      const formattedRepDate = this.datePipe.transform(this.data.representante?.nascimento, 'ddMMyyyy');
      
      this.form.patchValue({
        nome: this.data.contato.nome,
        email: this.data.contato.email,
        telefone: this.data.contato.telefone,
        cpf: this.data.cpf,
        rg: this.data.rg,
        dataNascimento: this.formatarData(this.data.nascimento),
        cep: this.data.endereco.cep,
        logradouro: this.data.endereco.logradouro,
        complemento: this.data.endereco.complemento,
        bairro: this.data.endereco.bairro,
        cidade: this.data.endereco.cidade,
        temRepresentante: this.temRepresentante(this.data.representante),
        representanteNome: this.data.representante?.contato.nome,
        representanteEmail: this.data.representante?.contato.email,
        representanteTelefone: this.data.representante?.contato.telefone,
        parentesco: this.data.representante?.parentesco,
        representanteCpf: this.data.representante?.cpf,
        representanteRg: this.data.representante?.rg,
        representanteDataNascimento: this.formatarData(this.data.representante?.nascimento),
      });
    }
    console.log('Data:', this.data);
  }

  formatarData(data: string): string {
    if (!data) return '';
    const [ano, mes, dia] = data.split('T')[0].split('-');
    return `${ano}-${mes}-${dia}`;
  }

  onCloseModal() {
    this.modalService.hide();
    this.closeModal.emit();
  }

  onNextStep() {
    if (this.form.valid) {
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  onPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onRepresentativeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.form.get('temRepresentante')?.setValue(target.value);
  }

  selectOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
  ];

  onSubmit() {
    this.isLoading = true;
    const dados = this.form.value;
  
    // Remover caracteres especiais do CEP
    const cepSemCaracteresEspeciais = dados.cep.replace(/\D/g, '');
  
    const payload = {
      contato: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone
      },
      cpf: dados.cpf,
      rg: dados.rg,
      nascimento: dados.dataNascimento,
      endereco: {
        cep: cepSemCaracteresEspeciais,
        logradouro: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade
      },
      representante: dados.temRepresentante === 'sim' ? {
        contato: {
          nome: dados.representanteNome,
          email: dados.representanteEmail,
          telefone: dados.representanteTelefone
        },
        parentesco: dados.parentesco,
        cpf: dados.representanteCpf,
        rg: dados.representanteRg,
        nascimento: dados.representanteDataNascimento
      } : null,
    };
  
    console.log('Payload:', payload);
    this.clientesService.atualizarUsuario(this.data.id, payload).subscribe(
      (response) => {
        this.isLoading = false;
        console.log('Usuário atualizado com sucesso!');
        console.log('Response:', response);
        this.onCloseModal();
      },
      (err) => {
        this.isLoading = false;
        console.error('Erro ao atualizar usuário:', err);
        const errorMessage = err.error.details ? err.error.details.join(', ') : 'Ocorreu um erro ao atualizar o usuário.';
        Swal.fire({
          icon: 'error',
          title: 'Erro ao atualizar usuário',
          text: errorMessage,
        });
      }
    );
  }

  temRepresentante(representante: any | null | undefined): string {
    return representante && representante.id ? 'sim' : 'nao';
  }

  hasMaxLengthAndRequiredError(input: string): boolean {
    return this.customValidationService.hasMaxLengthAndRequiredError(
      this.form,
      input
    );
  }

  getMaxLengthAndRequiredErrorMsg(input: string): string {
    return this.customValidationService.getMaxLengthAndRequiredErrorMsg(
      this.form,
      input
    );
  }

}