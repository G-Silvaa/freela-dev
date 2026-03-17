import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule, DatePipe } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { CustomValidationService } from '../add-users-modal/utils/customvalidators';
import Swal from 'sweetalert2';
import { DataInputComponent } from "../../../../../../../shared/components/inputs/data-input/data-input.component";

@Component({
  selector: 'app-edit-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, CommonModule, ReactiveFormsModule, DataInputComponent],
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
  private readonly representativeFields = [
    'representanteNome',
    'representanteEmail',
    'representanteTelefone',
    'parentesco',
    'representanteCpf',
    'representanteRg',
    'representanteDataNascimento',
  ] as const;
  readonly stepMeta = [
    {
      step: 1,
      label: 'Contato',
      title: 'Contato principal',
      description: 'Revise nome, e-mail e telefone para manter a comunicação do cliente atualizada.',
    },
    {
      step: 2,
      label: 'Dados',
      title: 'Documentos e nascimento',
      description: 'Ajuste CPF, RG e data de nascimento sempre que houver correção cadastral.',
    },
    {
      step: 3,
      label: 'Endereço',
      title: 'Localização e apoio',
      description: 'Confirme o endereço e indique se este cadastro possui representante vinculado.',
    },
    {
      step: 4,
      label: 'Representante',
      title: 'Dados do representante',
      description: 'Quando houver representação, valide contato, parentesco e documentos antes de salvar.',
    },
  ];

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private datePipe: DatePipe,
    private customValidationService: CustomValidationService
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      rg: ['',],
      dataNascimento: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      complemento: [''],
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
    this.form
      .get('temRepresentante')
      ?.valueChanges.subscribe(() => this.updateRepresentativeValidators());

    if (this.data) {
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

    this.updateRepresentativeValidators();
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
    const stepControls = this.getStepControls(this.currentStep);

    const invalidControls = stepControls.filter((control) => {
      const formControl = this.form.get(control);
      return formControl && formControl.enabled && formControl.invalid;
    });

    if (invalidControls.length === 0) {
      if (
        this.currentStep < 4 &&
        !(this.currentStep === 3 && this.form.get('temRepresentante')?.value === 'nao')
      ) {
        this.currentStep++;
      }
    } else {
      invalidControls.forEach((control) =>
        this.form.get(control)?.markAsTouched()
      );
    }
  }

  onPreviousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  get visibleSteps() {
    return this.stepMeta.filter((item) => this.shouldShowStep(item.step));
  }

  get currentStepMeta() {
    return this.stepMeta.find((item) => item.step === this.currentStep) ?? this.stepMeta[0];
  }

  get currentVisibleStepIndex(): number {
    const index = this.visibleSteps.findIndex((item) => item.step === this.currentStep);
    return index >= 0 ? index + 1 : this.visibleSteps.length;
  }

  get progressPercentage(): number {
    return (this.currentVisibleStepIndex / this.visibleSteps.length) * 100;
  }

  selectOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'nao', label: 'Não' },
  ];

  private stripNonDigits(value: string | null | undefined): string {
    return (value ?? '').replace(/\D/g, '');
  }

  private stripNonDigitsOrNull(value: string | null | undefined): string | null {
    const sanitizedValue = this.stripNonDigits(value);
    return sanitizedValue || null;
  }

  onSubmit() {
    if (this.form.invalid) {
      const currentStepControls = this.getStepControls(this.currentStep);

      currentStepControls.forEach((control) =>
        this.form.get(control)?.markAsTouched()
      );
      return;
    }

    this.isLoading = true;
    const dados = this.form.getRawValue();

    const cepSemCaracteresEspeciais = this.stripNonDigits(dados.cep);
    const cpfSemCaracteresEspeciais = this.stripNonDigits(dados.cpf);
    const rgSemCaracteresEspeciais = this.stripNonDigitsOrNull(dados.rg);
    const telefoneSemCaracteresEspeciais = this.stripNonDigits(dados.telefone);
    const representanteCpfSemCaracteresEspeciais = this.stripNonDigitsOrNull(dados.representanteCpf);
    const representanteRgSemCaracteresEspeciais = this.stripNonDigitsOrNull(dados.representanteRg);
    const representanteTelefoneSemCaracteresEspeciais = this.stripNonDigitsOrNull(dados.representanteTelefone);

    const payload = {
      contato: {
        nome: dados.nome,
        email: dados.email,
        telefone: telefoneSemCaracteresEspeciais,
      },
      cpf: cpfSemCaracteresEspeciais,
      rg: rgSemCaracteresEspeciais,
      nascimento: dados.dataNascimento,
      endereco: {
        cep: cepSemCaracteresEspeciais,
        logradouro: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
      },
      representante: dados.temRepresentante === 'sim' ? {
        contato: {
          nome: dados.representanteNome,
          email: dados.representanteEmail,
          telefone: representanteTelefoneSemCaracteresEspeciais,
        },
        parentesco: dados.parentesco,
        cpf: representanteCpfSemCaracteresEspeciais,
        rg: representanteRgSemCaracteresEspeciais,
        nascimento: dados.representanteDataNascimento,
      } : null,
      beneficios: dados.beneficios,
      valor: dados.preco
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

  shouldShowStep(step: number): boolean {
    if (step === 4 && this.form.get('temRepresentante')?.value === 'nao') {
      return false;
    }
    return true;
  }

  isStepCompleted(step: number): boolean {
    return this.currentStep > step;
  }

  private updateRepresentativeValidators(): void {
    const hasRepresentative = this.form.get('temRepresentante')?.value === 'sim';

    this.representativeFields.forEach((field) => {
      const control = this.form.get(field);

      if (!control) {
        return;
      }

      if (field === 'representanteEmail') {
        control.setValidators(
          hasRepresentative
            ? [Validators.required, Validators.email]
            : [Validators.email]
        );
      } else {
        control.setValidators(hasRepresentative ? [Validators.required] : []);
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  private getStepControls(step: number): string[] {
    switch (step) {
      case 1:
        return ['nome', 'email', 'telefone'];
      case 2:
        return ['rg', 'cpf', 'dataNascimento'];
      case 3:
        return [
          'cep',
          'logradouro',
          'complemento',
          'bairro',
          'cidade',
          'temRepresentante',
        ];
      case 4:
        return [...this.representativeFields];
      default:
        return [];
    }
  }

}
