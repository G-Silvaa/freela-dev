import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-add-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss']
})
export class AddUsersModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  currentStep = 1;
  form: FormGroup;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private clientesService: ClientesService
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
      parentesco: ['', Validators.required],
      representanteCpf: ['', Validators.required],
      representanteRg: ['', Validators.required],
      representanteDataNascimento: ['', Validators.required]
    });
  }

  onCloseModal() {
    this.modalService.hide();
    this.closeModal.emit();
  }

  onNextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
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
        cep: dados.cep,
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
    this.clientesService.adicionarUsuario(payload).subscribe(
      (response) => {
        this.clientesService.emitirClienteAdicionado(response);
        this.onCloseModal();
        this.isLoading = false;
        console.log('Usuário adicionado com sucesso!');
        console.log('Response:', response);
      },
      (err) => {
        this.isLoading = false;
        console.error('Erro ao adicionar usuário:', err);
      }
    );
  }
}