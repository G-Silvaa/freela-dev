import { Component, inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { InputLayoutComponent } from "@shared/components/input-layout/input-layout.component";
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    InputLayoutComponent,
    NgxMaskPipe,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    email: [""],
    password: [""],
  });

  submitLogin() {
    console.log(this.loginForm.value);
    this.router.navigate(["/home"]);
  }
}
