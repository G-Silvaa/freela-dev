import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-edit-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-users-modal.component.html',
  styleUrls: ['./edit-users-modal.component.scss']
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

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        nome: this.data.Nome,
        email: this.data['E-mail'],
        telefone: this.data.telefone,
        cpf: this.data.CPF,
        rg: this.data.RG,
        dataNascimento: this.data.nascimento,
        cep: this.data.endereco.cep,
        logradouro: this.data.endereco.logradouro,
        complemento: this.data.endereco.complemento,
        bairro: this.data.endereco.bairro,
        cidade: this.data.endereco.cidade,
        temRepresentante: this.data.representante ? 'sim' : 'nao',
        parentesco: this.data.representante?.parentesco,
        representanteCpf: this.data.representante?.cpf,
        representanteRg: this.data.representante?.rg,
        representanteDataNascimento: this.data.representante?.nascimento
      });
    }
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
      (Response) => {
        console.log('Usuário adicionado com sucesso!');
        console.log('Response:', Response);
        this.onCloseModal();
      },
      (err) => {
        console.error('Erro ao adicionar usuário:', err);
      }
    );
  }
}