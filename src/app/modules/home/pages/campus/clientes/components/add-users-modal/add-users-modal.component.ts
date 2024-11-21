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
import Swal from 'sweetalert2';
import { InputMoneyComponent } from "../../../../../../../shared/components/inputs/input-money/input-money.component";
import { DataInputComponent } from "../../../../../../../shared/components/inputs/data-input/data-input.component";

@Component({
  selector: 'app-add-users-modal',
  standalone: true,
  imports: [
    InputDefaultComponent,
    SelectInputComponent,
    ButtonComponent,
    CommonModule,
    ReactiveFormsModule,
    InputMoneyComponent,
    DataInputComponent
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
      rg: [''],
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
      beneficios: ['', Validators.required],
      preco: ['', Validators.required]
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

          // Desabilita os campos após preencher, exceto os especificados
          const fieldsToDisable = [
            'nome',
            'rg',
            'dataNascimento',
            'representanteNome',
            'representanteEmail',
            'representanteTelefone',
            'parentesco',
            'representanteCpf',
            'representanteRg',
            'representanteDataNascimento',
          ];

          fieldsToDisable.forEach((key) => {
            if (this.form.get(key)?.value) {
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

    // Função para converter data do formato brasileiro para o formato americano
    const converterDataParaAmericano = (data: string) => {
      const [dia, mes, ano] = data.split('/');
      return `${ano}-${mes}-${dia}`;
    };

    // Remover caracteres especiais dos campos e converter datas
    const dataNascimentoAmericano = converterDataParaAmericano(dados.dataNascimento);
    const representanteDataNascimentoAmericano = dados.representanteDataNascimento ? converterDataParaAmericano(dados.representanteDataNascimento) : null;
    const cepSemCaracteresEspeciais = dados.cep.replace(/\D/g, '');
    const cpfSemCaracteresEspeciais = dados.cpf.replace(/\D/g, '');
    const rgSemCaracteresEspeciais = dados.rg.replace(/\D/g, '');
    const telefoneSemCaracteresEspeciais = dados.telefone.replace(/\D/g, '');
    const representanteCpfSemCaracteresEspeciais = dados.representanteCpf ? dados.representanteCpf.replace(/\D/g, '') : null;
    const representanteRgSemCaracteresEspeciais = dados.representanteRg ? dados.representanteRg.replace(/\D/g, '') : null;
    const representanteTelefoneSemCaracteresEspeciais = dados.representanteTelefone ? dados.representanteTelefone.replace(/\D/g, '') : null;

    const payload = {
      contato: {
        nome: dados.nome,
        email: dados.email,
        telefone: telefoneSemCaracteresEspeciais,
      },
      cpf: cpfSemCaracteresEspeciais,
      rg: rgSemCaracteresEspeciais,
      nascimento: dataNascimentoAmericano,
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
        nascimento: representanteDataNascimentoAmericano,
      } : null,
      beneficios: dados.beneficios,
      valor: dados.preco
    };

    console.log('Payload:', payload);

    const beneficioPayload = {
      beneficio: dados.beneficios,
      valor: dados.preco,
      cliente: {
        id: this.existingUserId
      }
    };

    if (this.existingUserId) {
      // Update existing user
      this.clientesService.atualizarUsuario(this.existingUserId, payload).pipe(
        switchMap(() => this.clientesService.associarBeneficio(beneficioPayload))
      ).subscribe(
        (beneficioResponse) => {
          this.onCloseModal();
          this.isLoading = false;
          console.log('Usuário atualizado e benefício associado com sucesso!');
          console.log('Benefício Response:', beneficioResponse);
        },
        (err) => {
          this.isLoading = false;
          console.error('Erro ao atualizar usuário ou associar benefício:', err);
          const errorMessage = err.error.detail || 'Ocorreu um erro ao atualizar usuário ou associar benefício.';
          const titleMessage = err.error.title || 'Error.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: errorMessage,
          });
        }
      );
    } else {
      // Add new user
      this.clientesService.adicionarUsuario(payload).pipe(
        switchMap((response) => {
          beneficioPayload.cliente.id = response.id;
          return this.clientesService.associarBeneficio(beneficioPayload);
        })
      ).subscribe(
        (beneficioResponse) => {
          this.onCloseModal();
          this.isLoading = false;
          console.log('Usuário adicionado e benefício associado com sucesso!');
          console.log('Benefício Response:', beneficioResponse);
        },
        (err) => {
          this.isLoading = false;
          console.error('Erro ao adicionar usuário ou associar benefício:', err);
          const errorMessage = err.error.detail || 'Ocorreu um erro ao adicionar usuário ou associar benefício.';
          const titleMessage = err.error.title || 'Error.';
          Swal.fire({
            icon: 'error',
            title: titleMessage,
            text: errorMessage,
          });
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
