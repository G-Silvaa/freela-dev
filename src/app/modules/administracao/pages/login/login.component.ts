import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize } from "rxjs/operators";

import { AuthService } from "@core/services/auth/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  activeTab: "login" | "register" = "login";
  isSubmitting = false;
  feedbackMessage = "";
  feedbackTone: "error" | "success" | null = null;

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    senha: ["", [Validators.required, Validators.minLength(6)]],
  });

  registerForm = this.formBuilder.group({
    nome: ["", [Validators.required, Validators.maxLength(120)]],
    email: ["", [Validators.required, Validators.email]],
    senha: ["", [Validators.required, Validators.minLength(6)]],
    confirmacaoSenha: ["", [Validators.required, Validators.minLength(6)]],
  });

  submitLogin() {
    this.clearFeedback();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login(this.loginForm.getRawValue() as { email: string; senha: string })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          const redirectTo = this.route.snapshot.queryParamMap.get("redirectTo") || "/home";
          this.router.navigateByUrl(redirectTo);
        },
        error: (error) => {
          this.setFeedback(error?.error?.message ?? "Não foi possível entrar com essas credenciais.", "error");
        },
      });
  }

  submitRegister() {
    this.clearFeedback();

    if (this.registerForm.invalid || this.hasPasswordMismatch) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { nome, email, senha } = this.registerForm.getRawValue();

    this.authService
      .register({ nome: nome ?? "", email: email ?? "", senha: senha ?? "" })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.setFeedback("Conta criada com sucesso. Você já entrou no sistema.", "success");
          this.router.navigate(["/home"]);
        },
        error: (error) => {
          this.setFeedback(error?.error?.message ?? "Não foi possível concluir o cadastro.", "error");
        },
      });
  }

  switchTab(tab: "login" | "register"): void {
    this.activeTab = tab;
    this.clearFeedback();
  }

  get hasPasswordMismatch(): boolean {
    const senha = this.registerForm.controls.senha.value;
    const confirmacaoSenha = this.registerForm.controls.confirmacaoSenha.value;

    return Boolean(senha && confirmacaoSenha && senha !== confirmacaoSenha);
  }

  private clearFeedback(): void {
    this.feedbackMessage = "";
    this.feedbackTone = null;
  }

  private setFeedback(message: string, tone: "error" | "success"): void {
    this.feedbackMessage = message;
    this.feedbackTone = tone;
  }
}
