import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import {
  AuthUser,
  NivelUsuario,
  NivelUsuarioOption,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
} from '@core/interfaces/auth.interface';
import { AuthService } from '@core/services/auth/auth.service';
import { UsuariosService } from '@modules/administracao/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly authService = inject(AuthService);

  usuarios: AuthUser[] = [];
  niveis: NivelUsuarioOption[] = [];
  searchTerm = '';
  isLoading = false;
  isSaving = false;
  feedbackMessage = '';
  feedbackTone: 'success' | 'error' | null = null;
  editingUserId: number | null = null;

  readonly userForm = this.formBuilder.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    nivel: ['OPERADOR' as NivelUsuario, [Validators.required]],
    senha: ['', [Validators.minLength(6)]],
    ativo: [true],
  });

  ngOnInit(): void {
    this.applyPasswordValidator();
    this.loadData();
  }

  get filteredUsuarios(): AuthUser[] {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return this.usuarios;
    }

    return this.usuarios.filter((usuario) =>
      usuario.nome.toLowerCase().includes(normalizedSearch) ||
      usuario.email.toLowerCase().includes(normalizedSearch) ||
      this.getNivelLabel(usuario.nivel).toLowerCase().includes(normalizedSearch),
    );
  }

  get totalAdministradores(): number {
    return this.usuarios.filter((usuario) => usuario.nivel === 'ADMINISTRADOR').length;
  }

  get totalAtivos(): number {
    return this.usuarios.filter((usuario) => usuario.ativo).length;
  }

  get totalInativos(): number {
    return this.usuarios.filter((usuario) => !usuario.ativo).length;
  }

  get currentUserId(): number | null {
    return this.authService.currentUserValue?.id ?? null;
  }

  submit(): void {
    this.clearFeedback();
    this.applyPasswordValidator();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const formValue = this.userForm.getRawValue();
    const request$ = this.editingUserId
      ? this.usuariosService.atualizar(this.editingUserId, this.buildUpdatePayload(formValue))
      : this.usuariosService.criar(this.buildCreatePayload(formValue));

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          const editedOwnProfile = this.editingUserId === this.currentUserId;

          this.setFeedback(
            this.editingUserId ? 'Usuário atualizado com sucesso.' : 'Usuário cadastrado com sucesso.',
            'success',
          );
          this.resetForm();
          if (editedOwnProfile) {
            this.authService.refreshProfile().subscribe();
          }
          this.loadData();
        },
        error: (error) => {
          this.setFeedback(error?.error?.message ?? 'Não foi possível salvar o usuário.', 'error');
        },
      });
  }

  editUser(usuario: AuthUser): void {
    this.editingUserId = usuario.id;
    this.userForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      nivel: usuario.nivel,
      senha: '',
      ativo: usuario.ativo,
    });
    this.applyPasswordValidator();
    this.clearFeedback();
  }

  toggleStatus(usuario: AuthUser): void {
    if (usuario.id === this.currentUserId) {
      this.setFeedback('Você não pode desativar a sua própria conta por aqui.', 'error');
      return;
    }

    this.usuariosService
      .atualizar(usuario.id, { ativo: !usuario.ativo })
      .subscribe({
        next: () => {
          this.setFeedback(
            usuario.ativo ? 'Usuário desativado com sucesso.' : 'Usuário reativado com sucesso.',
            'success',
          );
          this.loadData();
        },
        error: (error) => {
          this.setFeedback(error?.error?.message ?? 'Não foi possível atualizar o status.', 'error');
        },
      });
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearFeedback();
  }

  getNivelLabel(nivel: NivelUsuario): string {
    return this.authService.getNivelLabel(nivel);
  }

  formatDate(value: string | null): string {
    if (!value) {
      return 'Ainda não acessou';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  private loadData(): void {
    this.isLoading = true;

    this.usuariosService
      .carregarPainelUsuarios()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ usuarios, niveis }) => {
          this.usuarios = usuarios;
          this.niveis = niveis;
        },
        error: (error) => {
          this.setFeedback(error?.error?.message ?? 'Não foi possível carregar os usuários.', 'error');
        },
      });
  }

  private buildCreatePayload(formValue: typeof this.userForm.value): UsuarioCreatePayload {
    return {
      nome: formValue.nome?.trim() ?? '',
      email: formValue.email?.trim() ?? '',
      senha: formValue.senha?.trim() ?? '',
      nivel: (formValue.nivel as NivelUsuario) ?? 'OPERADOR',
    };
  }

  private buildUpdatePayload(formValue: typeof this.userForm.value): UsuarioUpdatePayload {
    const payload: UsuarioUpdatePayload = {
      nome: formValue.nome?.trim() ?? '',
      email: formValue.email?.trim() ?? '',
      nivel: (formValue.nivel as NivelUsuario) ?? 'OPERADOR',
      ativo: Boolean(formValue.ativo),
    };

    if (formValue.senha?.trim()) {
      payload.senha = formValue.senha.trim();
    }

    return payload;
  }

  private resetForm(): void {
    this.editingUserId = null;
    this.userForm.reset({
      nome: '',
      email: '',
      nivel: 'OPERADOR',
      senha: '',
      ativo: true,
    });
    this.applyPasswordValidator();
  }

  private applyPasswordValidator(): void {
    const passwordControl = this.userForm.controls.senha;

    if (this.editingUserId) {
      passwordControl.setValidators([Validators.minLength(6)]);
    } else {
      passwordControl.setValidators([Validators.required, Validators.minLength(6)]);
    }

    passwordControl.updateValueAndValidity({ emitEvent: false });
  }

  private clearFeedback(): void {
    this.feedbackMessage = '';
    this.feedbackTone = null;
  }

  private setFeedback(message: string, tone: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackTone = tone;
  }
}
