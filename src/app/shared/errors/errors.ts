import { IErrorMsg } from '../domain-types/error-msg';

export const msg: IErrorMsg = {
  required: 'O campo é obrigatório',
  email: 'Email inválido',
  passwordMinLength: 'A senha deve conter no mínimo 8 caracteres',
  inputMaxLength: 'O campo deve conter no máximo 256 caracteres',
  inputMinLength: 'O campo deve conter no mínimo 3 caracteres',
  passwordDoNotMatch: 'As senhas não coincidem',
  cpf: 'CPF inválido',
  cnpj: 'CNPJ inválido',
  cep: 'CEP inválido',
  telefone: 'Telefone inválido',
};
