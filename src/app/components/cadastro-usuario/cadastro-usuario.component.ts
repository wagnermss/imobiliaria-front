
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, CadastroUsuarioPayload } from '../../services/auth.service';
import { extractApiErrorPayload, formatPhone, onlyDigits } from '../../utils/api-error.utils';

const cadastroUsuarioFields = ['nome', 'endereco', 'telefone', 'email', 'senha'] as const;
type CadastroUsuarioField = (typeof cadastroUsuarioFields)[number];

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-usuario.component.html'
})
export class CadastroUsuarioComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly cadastroForm = this.formBuilder.nonNullable.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    telefone: ['', [Validators.required, telefoneDigitsValidator]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  submitted = false;
  isSubmitting = false;
  mensagemErroGeral = '';
  apiFieldErrors: Partial<Record<CadastroUsuarioField, string>> = {};

  cadastrar(): void {
    this.submitted = true;
    this.mensagemErroGeral = '';
    this.apiFieldErrors = {};
    this.onTelefoneInput();

    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const formValue = this.cadastroForm.getRawValue();
    const novoUsuario: CadastroUsuarioPayload = {
      ...formValue,
      telefone: onlyDigits(formValue.telefone)
    };
    this.isSubmitting = true;

    this.authService.cadastrarUsuario(novoUsuario).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (erro) => {
        this.isSubmitting = false;
        const payload = extractApiErrorPayload(erro);
        let possuiErroPorCampo = false;

        Object.entries(payload.errors ?? {}).forEach(([campo, mensagem]) => {
          if (this.isCadastroUsuarioField(campo)) {
            this.apiFieldErrors[campo] = mensagem;
            this.cadastroForm.controls[campo].markAsTouched();
            possuiErroPorCampo = true;
          }
        });

        if (!possuiErroPorCampo) {
          this.mensagemErroGeral = payload.message ?? 'Erro ao cadastrar usuário.';
        }
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/login']);
  }

  onTelefoneInput(): void {
    const telefoneControl = this.cadastroForm.controls.telefone;
    const telefoneFormatado = formatPhone(telefoneControl.value);

    if (telefoneFormatado !== telefoneControl.value) {
      telefoneControl.setValue(telefoneFormatado, { emitEvent: false });
    }

    this.clearFieldError('telefone');
  }

  clearFieldError(field: CadastroUsuarioField): void {
    delete this.apiFieldErrors[field];
  }

  getErrorMessage(field: CadastroUsuarioField): string | null {
    if (this.apiFieldErrors[field]) {
      return this.apiFieldErrors[field] ?? null;
    }

    const control = this.cadastroForm.controls[field];
    if (!(control.touched || this.submitted) || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      const requiredMessages: Record<CadastroUsuarioField, string> = {
        nome: 'Nome obrigatório.',
        endereco: 'Endereço obrigatório.',
        telefone: 'Telefone obrigatório.',
        email: 'E-mail obrigatório.',
        senha: 'Senha obrigatória.'
      };

      return requiredMessages[field];
    }

    if (field === 'telefone' && control.errors['telefoneInvalido']) {
      return 'Telefone deve conter apenas números e ter 10 ou 11 dígitos.';
    }

    if (field === 'email' && control.errors['email']) {
      return 'Informe um e-mail válido.';
    }

    return null;
  }

  private isCadastroUsuarioField(field: string): field is CadastroUsuarioField {
    return cadastroUsuarioFields.includes(field as CadastroUsuarioField);
  }
}

function telefoneDigitsValidator(control: AbstractControl<string>): ValidationErrors | null {
  const digits = onlyDigits(control.value ?? '');
  return digits.length === 10 || digits.length === 11
    ? null
    : { telefoneInvalido: true };
}
