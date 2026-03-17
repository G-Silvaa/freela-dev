export type NivelUsuario = 'ADMINISTRADOR' | 'GESTOR' | 'OPERADOR';

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  nivel: NivelUsuario;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  ultimoAcesso: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface NivelUsuarioOption {
  value: NivelUsuario;
  label: string;
}

export interface UsuarioCreatePayload {
  nome: string;
  email: string;
  senha: string;
  nivel: NivelUsuario;
}

export interface UsuarioUpdatePayload {
  nome?: string;
  email?: string;
  senha?: string;
  nivel?: NivelUsuario;
  ativo?: boolean;
}
