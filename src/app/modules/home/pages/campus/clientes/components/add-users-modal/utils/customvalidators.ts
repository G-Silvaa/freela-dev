import { Injectable } from '@angular/core';
import { ValidationService } from '@shared/validators/validators.service'; // Ajuste o caminho conforme necessário

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  constructor(private validatorsService: ValidationService) {}

  hasMaxLengthAndRequiredError(form: any, input: string): boolean {
    return this.validatorsService.hasMaxLengthAndRequiredError(form, input);
  }

  getMaxLengthAndRequiredErrorMsg(form: any, input: string): string {
    return this.validatorsService.hasMaxLengthAndRequiredMsgError(form, input);
  }

  hasNumeroCartaoError(form: any): boolean {
    return (
      this.validatorsService.isInvalid(form, 'NumeroCartao', 'required') ||
      this.validatorsService.isInvalid(form, 'NumeroCartao', 'numeroCartao')
    );
  }


  hasEmailError(form: any): boolean {
    return (
      this.validatorsService.isInvalid(form, 'Email', 'required') ||
      this.validatorsService.isInvalid(form, 'Email', 'invalidEmail')
    );
  }

  getEmailErrorMsg(form: any): string {
    if (this.validatorsService.isInvalid(form, 'Email', 'required')) {
      return this.validatorsService.msg.required;
    } else {
      return this.validatorsService.msg.email;
    }
  }

  hasDataNascimentoError(form: any): boolean {
    return (
      this.validatorsService.isInvalid(form, 'DataNascimento', 'required') ||
      this.validatorsService.isInvalid(form, 'DataNascimento', 'invalidDate')
    );
  }

  getDataNascimentoErrorMsg(form: any): string {
    if (this.validatorsService.isInvalid(form, 'DataNascimento', 'required')) {
      return this.validatorsService.msg.required;
    } else {
      return 'Data inválida.';
    }
  }

  hasInicioPeriodoAcessoError(form: any): boolean {
    return (
      this.validatorsService.isInvalid(form, 'InicioPeriodoAcesso', 'required') ||
      this.validatorsService.isInvalid(form, 'InicioPeriodoAcesso', 'dateRange')
    );
  }

  getInicioPeriodoAcessoErrorMsg(form: any): string {
    if (this.validatorsService.isInvalid(form, 'InicioPeriodoAcesso', 'required')) {
      return this.validatorsService.msg.required;
    } else {
      return 'A data de início não pode ser maior que a data de encerramento.';
    }
  }

  hasFimPeriodoAcessoError(form: any): boolean {
    return (
      this.validatorsService.isInvalid(form, 'FimPeriodoAcesso', 'required') ||
      this.validatorsService.isInvalid(form, 'FimPeriodoAcesso', 'dateRange')
    );
  }

  getFimPeriodoAcessoErrorMsg(form: any): string {
    if (this.validatorsService.isInvalid(form, 'FimPeriodoAcesso', 'required')) {
      return this.validatorsService.msg.required;
    } else {
      return 'A data de encerramento não pode ser menor que a data de início.';
    }
  }
}