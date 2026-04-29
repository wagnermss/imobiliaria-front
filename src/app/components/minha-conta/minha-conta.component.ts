import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';
import { formatPhone, onlyDigits } from '../../utils/api-error.utils';

type ContaField = 'nome' | 'endereco' | 'telefone' | 'email';

@Component({
  selector: 'app-minha-conta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    DividerModule,
    FluidModule,
    InputTextModule,
    MessageModule
  ],
  templateUrl: './minha-conta.component.html',
  styleUrl: './minha-conta.component.css'
})
export class MinhaContaComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly contaForm = this.formBuilder.nonNullable.group({
    nome: ['', Validators.required],
    endereco: ['', Validators.required],
    telefone: ['', [Validators.required, telefoneDigitsValidator]],
    email: ['', [Validators.required, Validators.email]]
  });

  submitted = false;
  mensagemSucesso = '';

  get usuarioInicial(): string {
    const nome = this.contaForm.controls.nome.value.trim();
    return nome ? nome.charAt(0).toUpperCase() : 'U';
  }

  constructor() {
    const usuarioAtual = this.authService.getUsuarioAtual();

    this.contaForm.patchValue({
      nome: usuarioAtual?.nome ?? '',
      endereco: usuarioAtual?.endereco ?? '',
      telefone: usuarioAtual?.telefone ? formatPhone(String(usuarioAtual.telefone)) : '',
      email: usuarioAtual?.email ?? ''
    });
  }

  salvar(): void {
    this.submitted = true;
    this.mensagemSucesso = '';
    this.onTelefoneInput();

    if (this.contaForm.invalid) {
      this.contaForm.markAllAsTouched();
      return;
    }

    const formValue = this.contaForm.getRawValue();
    this.authService.atualizarUsuarioLocal({
      nome: formValue.nome.trim(),
      endereco: formValue.endereco.trim(),
      telefone: onlyDigits(formValue.telefone),
      email: formValue.email.trim()
    });

    this.mensagemSucesso = 'Dados atualizados com sucesso.';
  }

  onTelefoneInput(): void {
    const telefoneControl = this.contaForm.controls.telefone;
    const telefoneFormatado = formatPhone(telefoneControl.value);

    if (telefoneFormatado !== telefoneControl.value) {
      telefoneControl.setValue(telefoneFormatado, { emitEvent: false });
    }
  }

  getErrorMessage(field: ContaField): string | null {
    const control = this.contaForm.controls[field];
    if (!(control.touched || this.submitted) || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      const requiredMessages: Record<ContaField, string> = {
        nome: 'Nome obrigatório.',
        endereco: 'Endereço obrigatório.',
        telefone: 'Telefone obrigatório.',
        email: 'E-mail obrigatório.'
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
}

function telefoneDigitsValidator(control: AbstractControl<string>): ValidationErrors | null {
  const digits = onlyDigits(control.value ?? '');
  return digits.length === 10 || digits.length === 11
    ? null
    : { telefoneInvalido: true };
}
