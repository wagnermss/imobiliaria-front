import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, LoginPayload } from '../../services/auth.service';
import { extractApiErrorPayload } from '../../utils/api-error.utils';

const loginFields = ['email', 'senha'] as const;
type LoginField = (typeof loginFields)[number];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  submitted = false;
  isSubmitting = false;
  mensagemErroGeral = '';
  apiFieldErrors: Partial<Record<LoginField, string>> = {};

  fazerLogin(): void {
    this.submitted = true;
    this.mensagemErroGeral = '';
    this.apiFieldErrors = {};

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credenciais: LoginPayload = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authService.login(credenciais).subscribe({
      next: (usuario) => {
        this.isSubmitting = false;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/lista']);
      },
      error: (erro) => {
        this.isSubmitting = false;
        const payload = extractApiErrorPayload(erro);
        let possuiErroPorCampo = false;

        Object.entries(payload.errors ?? {}).forEach(([campo, mensagem]) => {
          if (this.isLoginField(campo)) {
            this.apiFieldErrors[campo] = mensagem;
            this.loginForm.controls[campo].markAsTouched();
            possuiErroPorCampo = true;
          }
        });

        if (!possuiErroPorCampo) {
          this.mensagemErroGeral =
            payload.message ?? 'Falha no login. Verifique seu e-mail e senha.';
        }
      }
    });
  }

  clearFieldError(field: LoginField): void {
    delete this.apiFieldErrors[field];
  }

  getErrorMessage(field: LoginField): string | null {
    if (this.apiFieldErrors[field]) {
      return this.apiFieldErrors[field] ?? null;
    }

    const control = this.loginForm.controls[field];
    if (!(control.touched || this.submitted) || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      return field === 'email' ? 'E-mail obrigatório.' : 'Senha obrigatória.';
    }

    if (control.errors['email']) {
      return 'Informe um e-mail válido.';
    }

    return null;
  }

  private isLoginField(field: string): field is LoginField {
    return loginFields.includes(field as LoginField);
  }
}
