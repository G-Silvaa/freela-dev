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

  //Errors

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

  //Error messages

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
}
