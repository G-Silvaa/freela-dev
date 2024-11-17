import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputDefaultComponent } from '../../../../../../../shared/components/inputs/input-default/input-default.component';
import { SelectInputComponent } from '../../../../../../../shared/components/inputs/select-input/select-input.component';
import { ButtonComponent } from '../../../../../../../shared/components/button/button.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { ClientesService } from '../../services/clientes.service';
import { CustomValidationService } from './utils/customvalidators'; // Importar o CustomValidationService
import { Subject } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-users-modal',
  standalone: true,
  imports: [
    InputDefaultComponent,
    SelectInputComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-users-modal.component.html',
  styleUrls: ['./add-users-modal.component.scss'],
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
      beneficios: ['', Validators.required],
    });
  }
  ngOnInit() {
    let isUpdating = false;
    let cpfValidado = false;
  
    // Observe changes to the CPF input field
    this.form
      .get('cpf')
      ?.valueChanges.pipe(
        debounceTime(300),
        switchMap((cpf) => {
          // Remove the mask (remove non-numeric characters)
          const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : ''; // Remove todos os caracteres não numéricos
  
          // Quando o CPF tem 11 caracteres e não foi validado
          if (cpfLimpo.length === 11 && !cpfValidado) {
            console.log('CPF atingiu 11 caracteres, disparando requisição:', cpfLimpo);
  
            cpfValidado = true;
  
            // Fazer a requisição para buscar o cliente com o CPF limpo
            return this.clientesService.buscarClientesComFiltros({ cpf: cpfLimpo });
          } else if (cpfLimpo.length === 11) {
            return []; // Já foi validado, retorna um array vazio
          } else {
            return []; // CPF com menos de 11 dígitos não dispara a requisição
          }
        })
      )
      .subscribe((response) => {
        if (response?.content?.length > 0) {
          const cliente = response.content[0];
          this.existingUserId = cliente.id;
  
          const datePipe = new DatePipe('en-US');
          const formattedDate = datePipe.transform(cliente.nascimento, 'ddMMyyyy');
  
          isUpdating = true;
          // Preenche o formulário com os dados do cliente
          this.form.patchValue({
            nome: cliente.contato.nome,
            email: cliente.contato.email,
            telefone: cliente.contato.telefone,
            cpf: cliente.cpf,  // Mantém o CPF com a máscara, que é o formato esperado
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
            representanteDataNascimento: cliente.representante?.nascimento,
          });
  
          // Desabilita os campos após preencher, exceto o CPF
          Object.keys(this.form.controls).forEach((key) => {
            if (key !== 'cpf' && this.form.get(key)?.value) {
              this.form.get(key)?.disable({ emitEvent: false });
            }
          });
  
          console.log('Formulário preenchido:', this.form.value);
          isUpdating = false;
        } else {
          this.existingUserId = null;
          console.log('Nenhum usuário encontrado com este CPF.');
        }
      });
  
    // Observe the CPF field changes to clear the other fields when CPF is deleted
    this.form.get('cpf')?.valueChanges.subscribe((value) => {
      if (!value) {
        const fieldsToClear = [
          'nome',
          'email',
          'telefone',
          'rg',
          'dataNascimento',
          'cep',
          'logradouro',
          'complemento',
          'bairro',
          'cidade',
          'representanteNome',
          'representanteEmail',
          'representanteTelefone',
          'parentesco',
          'representanteCpf',
          'representanteRg',
          'representanteDataNascimento',
        ];
  
        // Limpa os campos e os habilita novamente
        fieldsToClear.forEach((field) => {
          const control = this.form.get(field);
          if (control) {
            control.reset();
            control.enable({ emitEvent: false });
          }
        });
  
        this.existingUserId = null;
        cpfValidado = false;
        console.log('Campos limpos, CPF apagado.');
      }
    });
  
    this.form.get('cpf')?.updateValueAndValidity();
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
        this.currentStep === 3 &&
        this.form.get('temRepresentante')?.value === 'nao'
      ) {
        this.currentStep = 5;
      } else {
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
      if (
        this.currentStep === 5 &&
        this.form.get('temRepresentante')?.value === 'nao'
      ) {
        this.currentStep = 3;
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
    { value: '80', label: 'Salário Maternidade' },
  ];

  onSubmit() {
    this.isLoading = true;

    const dados = this.form.getRawValue();
    
  const cepSemCaracteresEspeciais = dados.cep.replace(/\D/g, '');
    const payload = {
      contato: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
      },
      cpf: dados.cpf,
      rg: dados.rg,
      nascimento: dados.dataNascimento,
      endereco: {
        cep: cepSemCaracteresEspeciais,
        logradouro: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.cidade,
      },
      representante:
        dados.temRepresentante === 'sim'
          ? {
              contato: {
                nome: dados.representanteNome,
                email: dados.representanteEmail,
                telefone: dados.representanteTelefone,
              },
              parentesco: dados.parentesco,
              cpf: dados.representanteCpf,
              rg: dados.representanteRg,
              nascimento: dados.representanteDataNascimento,
            }
          : null,
      beneficios: dados.beneficios,
    };

    console.log('Payload:', payload);

    if (this.existingUserId) {
      this.clientesService
        .atualizarUsuario(this.existingUserId, payload)
        .subscribe(
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
      this.clientesService.adicionarUsuario(payload).subscribe(
        (response) => {
          console.log('Usuário adicionado com sucesso!');
          this.onCloseModal();
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          console.error('Erro ao adicionar usuário:', err);
        }
      );
    }
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

  private getStepControls(step: number): string[] {
    switch (step) {
      case 1:
        return ['rg', 'cpf', 'dataNascimento'];
      case 2:
        return ['nome', 'email', 'telefone'];
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
        return [
          'representanteNome',
          'representanteEmail',
          'representanteTelefone',
          'parentesco',
          'representanteCpf',
          'representanteRg',
          'representanteDataNascimento',
        ];
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
