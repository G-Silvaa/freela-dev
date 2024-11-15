import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { msg } from '../errors';
import { IErrorMsg } from '../domain-types/error-msg';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  msg: IErrorMsg = msg;
  passwordPattern = /^.{8,}$/;

  // Errors

  hasMaxLengthAndRequiredError(form: AbstractControl, input: string): boolean {
    return (
      this.isInvalid(form, input, 'required') ||
      this.isInvalid(form, input, 'maxlength') ||
      this.isInvalid(form, input, 'minlength')
    );
  }

  passwordLengthValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.length < minLength) {
        return { passwordLength: true };
      }
      return null;
    };
  }

  passwordsMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (password !== passwordConfirm) {
      control.get('passwordConfirm')?.setErrors({ match: true });
      return { match: true };
    } else {
      control.get('passwordConfirm')?.setErrors(null);
      return null;
    }
  }

  hasPasswordError(form: AbstractControl): boolean {
    return (
      this.isInvalid(form, 'password', 'required') ||
      this.isInvalid(form, 'password', 'passwordLength') ||
      this.isInvalid(form, 'password', 'maxlength')
    );
  }

  hasPasswordMatchError(form: AbstractControl): boolean {
    return (
      this.isInvalid(form, 'passwordConfirm', 'required') ||
      this.isInvalid(form, 'passwordConfirm', 'match')
    );
  }

  hasCnpjError(form: AbstractControl) {
    const cnpjFormControl = form.get('cnpj');

    if (!cnpjFormControl || !cnpjFormControl.touched) {
      return false;
    }

    const isRequiredError = cnpjFormControl.hasError('required');

    const cnpjErrors = cnpjFormControl.errors;
    const isCnpjError = cnpjErrors && !isRequiredError;

    return !!isRequiredError || !!isCnpjError;
  }

  hasCpfError(form: AbstractControl) {
    const cpfFormControl = form.get('cpf');

    if (!cpfFormControl || !cpfFormControl.touched) {
      return false;
    }

    const isRequiredError = cpfFormControl.hasError('required');

    const cpfErrors = cpfFormControl.errors;
    const isCpfError = cpfErrors && !isRequiredError;

    return !!isRequiredError || !!isCpfError;
  }

  hasTelefoneError(form: AbstractControl) {
    const telefoneFormControl = form.get('telefone');

    if (!telefoneFormControl || !telefoneFormControl.touched) {
      return false;
    }

    const isRequiredError = telefoneFormControl.hasError('required');

    const telefoneErrors = telefoneFormControl.errors;
    const isTelefoneError = telefoneErrors && !isRequiredError;

    return !!isRequiredError || !!isTelefoneError;
  }

  hasCepError(form: AbstractControl) {
    const cepFormControl = form.get('cep');

    if (!cepFormControl || !cepFormControl.touched) {
      return false;
    }

    const isRequiredError = cepFormControl.hasError('required');

    const cepErrors = cepFormControl.errors;
    const isCepError = cepErrors && !isRequiredError;

    return !!isRequiredError || !!isCepError;
  }

  isInvalid(
    form: AbstractControl,
    inputName: string,
    validatorName: string
  ): boolean {
    const formControl = form.get(inputName);
    return !!(
      formControl &&
      formControl.errors &&
      formControl.errors[validatorName] &&
      formControl.touched
    );
  }

  // Error messages

  hasMsgPasswordError(form: AbstractControl): string {
    if (this.isInvalid(form, 'password', 'required')) {
      return this.msg.required;
    } else {
      return this.msg.passwordMinLength;
    }
  }

  hasMsgPasswordMatchError(form: AbstractControl): string {
    if (this.isInvalid(form, 'passwordConfirm', 'required')) {
      return this.msg.required;
    } else {
      return this.msg.passwordDoNotMatch;
    }
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const validEmail = emailPattern.test(control.value);
      const validLength = typeof control.value === 'string' && control.value.length <= 150;
      if (!validEmail) {
        return { invalidEmail: true };
      }
      if (!validLength) {
        return { maxLengthExceeded: true };
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { required: true };
      }
      const date = new Date(control.value);
      const year = date.getFullYear();
      if (isNaN(date.getTime()) || year < 1900) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  dateRangeValidator(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDateControl = control.get(startDateControlName);
      const endDateControl = control.get(endDateControlName);
  
      if (!startDateControl || !endDateControl) {
        return null;
      }
  
      const startDate = startDateControl.value ? new Date(startDateControl.value) : null;
      const endDate = endDateControl.value ? new Date(endDateControl.value) : null;
  
      if (startDate && endDate && startDate > endDate) {
        endDateControl.setErrors({ dateRange: true });
        return { dateRange: true };
      }
  
      if (endDateControl.hasError('dateRange')) {
        endDateControl.setErrors(null);
      }
  
      return null;
    };
  }

  hasMaxLengthAndRequiredMsgError(
    form: AbstractControl,
    input: string
  ): string {
    if (this.isInvalid(form, input, 'required')) {
      return this.msg.required;
    } else if (this.isInvalid(form, input, 'maxlength')) {
      return this.msg.inputMaxLength;
    } else {
      return this.msg.inputMinLength;
    }
  }

  hasNumeroCartaoError(form: AbstractControl) {
    const numeroCartaoFormControl = form.get('numeroCartao');

    if (!numeroCartaoFormControl || !numeroCartaoFormControl.touched) {
      return false;
    }

    const isRequiredError = numeroCartaoFormControl.hasError('required');

    const numeroCartaoErrors = numeroCartaoFormControl.errors;
    const isNumeroCartaoError = numeroCartaoErrors && !isRequiredError;

    return !!isRequiredError || !!isNumeroCartaoError;
  }

}