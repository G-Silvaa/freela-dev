import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { CustomValidationService } from './utils/customvalidators'; // Importar o CustomValidationService

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
    private clientesService: ClientesService,
    private customValidationService: CustomValidationService // Injetar o CustomValidationService
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
      beneficios: ['', Validators.required] // Adicionar campo de benefícios
    });

    this.form.get('temRepresentante')?.valueChanges.subscribe(value => {
      if (value === 'sim') {
        this.form.get('representanteNome')?.setValidators(Validators.required);
        this.form.get('representanteEmail')?.setValidators([Validators.required, Validators.email]);
        this.form.get('representanteTelefone')?.setValidators(Validators.required);
        this.form.get('parentesco')?.setValidators(Validators.required);
        this.form.get('representanteCpf')?.setValidators(Validators.required);
        this.form.get('representanteRg')?.setValidators(Validators.required);
        this.form.get('representanteDataNascimento')?.setValidators(Validators.required);
      } else {
        this.form.get('representanteNome')?.clearValidators();
        this.form.get('representanteEmail')?.clearValidators();
        this.form.get('representanteTelefone')?.clearValidators();
        this.form.get('parentesco')?.clearValidators();
        this.form.get('representanteCpf')?.clearValidators();
        this.form.get('representanteRg')?.clearValidators();
        this.form.get('representanteDataNascimento')?.clearValidators();
      }
      this.form.get('representanteNome')?.updateValueAndValidity();
      this.form.get('representanteEmail')?.updateValueAndValidity();
      this.form.get('representanteTelefone')?.updateValueAndValidity();
      this.form.get('parentesco')?.updateValueAndValidity();
      this.form.get('representanteCpf')?.updateValueAndValidity();
      this.form.get('representanteRg')?.updateValueAndValidity();
      this.form.get('representanteDataNascimento')?.updateValueAndValidity();
    });
  }

  onCloseModal() {
    this.modalService.hide();
    this.closeModal.emit();
  }

  onNextStep() {
    const stepControls = this.getStepControls(this.currentStep);
    if (stepControls.every(control => this.form.get(control)?.valid)) {
      if (this.currentStep === 3 && this.form.get('temRepresentante')?.value === 'nao') {
        this.currentStep = 5; // Pular diretamente para "Benefícios"
      } else {
        this.currentStep++;
      }
    } else {
      stepControls.forEach(control => this.form.get(control)?.markAsTouched());
    }
  }

  onPreviousStep() {
    if (this.currentStep > 1) {
      if (this.currentStep === 5 && this.form.get('temRepresentante')?.value === 'nao') {
        this.currentStep = 3; // Voltar diretamente para "Endereço"
      } else {
        this.currentStep--;
      }
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


  beneficiosOptions = [
    { value: '87', label: 'BPC/LOAS ao Deficiente' },
    { value: '88', label: 'BPC/LOAS ao Idoso' },
    { value: '41', label: 'Aposentadoria por Idade' },
    { value: '42', label: 'Aposentadoria por Tempo de Contribuição' },
    { value: '32', label: 'Aposentadoria por Invalidez' },
    { value: '21', label: 'Pensão por Morte' },
    { value: '25', label: 'Auxílio Reclusão' },
    { value: '31', label: 'Auxílio por Incapacidade Temporária' },
    { value: '36', label: 'Auxílio Acidente' },
    { value: '80', label: 'Salário Maternidade' }
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
      beneficios: dados.beneficios
    };
    console.log('Payload:', payload);
    this.clientesService.adicionarUsuario(payload).subscribe(
      (response) => {
        this.clientesService.adicionarUsuario(response);
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

  hasMaxLengthAndRequiredError(input: string): boolean {
    return this.customValidationService.hasMaxLengthAndRequiredError(this.form, input);
  }

  getMaxLengthAndRequiredErrorMsg(input: string): string {
    return this.customValidationService.getMaxLengthAndRequiredErrorMsg(this.form, input);
  }

  private getStepControls(step: number): string[] {
    switch (step) {
      case 1:
        return ['nome', 'email', 'telefone'];
      case 2:
        return ['rg', 'cpf', 'dataNascimento'];
      case 3:
        return ['cep', 'logradouro', 'complemento', 'bairro', 'cidade', 'temRepresentante'];
      case 4:
        return ['representanteNome', 'representanteEmail', 'representanteTelefone', 'parentesco', 'representanteCpf', 'representanteRg', 'representanteDataNascimento'];
      case 5:
        return ['beneficios'];
      default:
        return [];
    }
  }

  shouldShowStep(step: number): boolean {
    if (step === 4 && this.form.get('temRepresentante')?.value === 'nao') {
      return false;
    }
    return true;
  }
}