import { CommonModule } from "@angular/common";
import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";

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
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  });

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.router.navigate(["/home"]);
  }
}
