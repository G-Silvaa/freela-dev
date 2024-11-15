import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputDefaultComponent } from "../../../../../../../shared/components/inputs/input-default/input-default.component";
import { SelectInputComponent } from "../../../../../../../shared/components/inputs/select-input/select-input.component";
import { ButtonComponent } from "../../../../../../../shared/components/button/button.component";
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { CustomValidationService } from './utils/customvalidators'; // Importar o CustomValidationService
import { Subject } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-users-modal',
  standalone: true,
  imports: [InputDefaultComponent, SelectInputComponent, ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss']
})
export class AddUsersModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;
  currentStep = 1;
  form: FormGroup;
  private cpfSubject = new Subject<string>();
  private existingUserId: number | null = null;

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
  }

  ngOnInit() {
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
  
    this.cpfSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(cpf => {
        console.log('CPF digitado:', cpf);
        return this.clientesService.buscarClientesComFiltros({ cpf });
      })
    ).subscribe(response => {
      console.log('Resposta da API:', response);
      if (response && response.content && response.content.length > 0) {
        const cliente = response.content[0];
        this.existingUserId = cliente.id;
        console.log('Usuário encontrado:', cliente);
  
        // Format the date to DDMMYYYY
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(cliente.nascimento, 'ddMMyyyy');
  
        this.form.patchValue({
          nome: cliente.contato.nome,
          email: cliente.contato.email,
          telefone: cliente.contato.telefone,
          cpf: cliente.cpf,
          rg: cliente.rg,
          dataNascimento: formattedDate,
          cep: cliente.endereco.cep,
          logradouro: cliente.endereco.logradouro,
          complemento: cliente.endereco.complemento,
          bairro: cliente.endereco.bairro,
          cidade: cliente.endereco.cidade,
          temRepresentante: this.temRepresentante(cliente.representante),
          representanteNome: cliente.representante?.contato.nome,
          representanteEmail: cliente.representante?.contato.email,
          representanteTelefone: cliente.representante?.contato.telefone,
          parentesco: cliente.representante?.parentesco,
          representanteCpf: cliente.representante?.cpf,
          representanteRg: cliente.representante?.rg,
          representanteDataNascimento: cliente.representante?.nascimento
        });
        console.log('Formulário preenchido:', this.form.value);
  
        // Mark all fields as touched and update their validity
        Object.keys(this.form.controls).forEach(field => {
          const control = this.form.get(field);
          control?.markAsTouched({ onlySelf: true });
          control?.updateValueAndValidity({ onlySelf: true });
        });
      } else {
        this.existingUserId = null;
        console.log('Nenhum usuário encontrado com este CPF.');
      }
    });
  
    this.form.get('cpf')?.valueChanges.subscribe(value => {
      if (value.length === 11) {
        this.cpfSubject.next(value);
      }
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

    if (this.existingUserId) {
      // Update existing user
      this.clientesService.atualizarUsuario(this.existingUserId, payload).subscribe(
        (response) => {
          this.onCloseModal();
          this.isLoading = false;
          console.log('Usuário atualizado com sucesso!');
        },
        (err) => {
          this.isLoading = false;
          console.error('Erro ao atualizar usuário:', err);
        }
      );
    } else {
      // Add new user
      this.clientesService.adicionarUsuario(payload).subscribe(
        (response) => {
          const clienteId = response.id;
          const beneficioPayload = {
            beneficio: dados.beneficios,
            cliente: {
              id: clienteId
            }
          };
          this.clientesService.associarBeneficio(beneficioPayload).subscribe(
            (beneficioResponse) => {
              this.onCloseModal();
              this.isLoading = false;
              console.log('Benefício associado com sucesso!');
              console.log('Benefício Response:', beneficioResponse);
            },
            (err) => {
              this.isLoading = false;
              console.error('Erro ao associar benefício:', err);
            }
          );
        },
        (err) => {
          this.isLoading = false;
          console.error('Erro ao adicionar usuário:', err);
        }
      );
    }
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
        return ['rg', 'cpf', 'dataNascimento'];
      case 2:
        return ['nome', 'email', 'telefone'];
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

  temRepresentante(representante: any | null | undefined): string {
    return representante && representante.id ? 'sim' : 'nao';
  }
}