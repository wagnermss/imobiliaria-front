import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../../services/imovel.service';
import { Imovel } from '../../models/imovel';
import {
  extractApiErrorPayload,
  formatCurrencyInput,
  parseCurrencyInput
} from '../../utils/api-error.utils';

const imovelFields = ['titulo', 'endereco', 'bairro', 'zona', 'valor'] as const;
type ImovelField = (typeof imovelFields)[number];

@Component({
  selector: 'app-cadastro-imovel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-imovel.component.html'
})
export class CadastroImovelComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly imovelService = inject(ImovelService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly imovelForm = this.formBuilder.group({
    titulo: this.formBuilder.nonNullable.control('', Validators.required),
    endereco: this.formBuilder.nonNullable.control('', Validators.required),
    bairro: this.formBuilder.nonNullable.control('', Validators.required),
    zona: this.formBuilder.nonNullable.control('', Validators.required),
    valor: this.formBuilder.nonNullable.control('', [
      Validators.required,
      valorMonetarioValidator
    ])
  });

  idEdicao: number | null = null;
  submitted = false;
  isSubmitting = false;
  mensagemErroGeral = '';
  apiFieldErrors: Partial<Record<ImovelField, string>> = {};

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idEdicao = Number(idParam);
      this.imovelService.buscarPorId(this.idEdicao).subscribe({
        next: (dados) => {
          this.imovelForm.patchValue({
            titulo: dados.titulo,
            endereco: dados.endereco,
            bairro: dados.bairro,
            zona: dados.zona,
            valor: formatCurrencyInput(dados.valor)
          });
        },
        error: () => {
          this.mensagemErroGeral = 'Não foi possível carregar o imóvel para edição.';
        }
      });
    }
  }

  salvar(): void {
    this.submitted = true;
    this.mensagemErroGeral = '';
    this.apiFieldErrors = {};
    this.onValorInput();

    if (this.imovelForm.invalid) {
      this.imovelForm.markAllAsTouched();
      return;
    }

    const formValue = this.imovelForm.getRawValue();
    const valorNumerico = parseCurrencyInput(formValue.valor);
    if (valorNumerico === null) {
      this.imovelForm.controls.valor.markAsTouched();
      return;
    }

    const payload: Imovel = {
      titulo: formValue.titulo,
      endereco: formValue.endereco,
      bairro: formValue.bairro,
      zona: formValue.zona,
      valor: valorNumerico
    };

    this.isSubmitting = true;

    const requisicao = this.idEdicao !== null
      ? this.imovelService.atualizarImovel(this.idEdicao, payload)
      : this.imovelService.cadastrarImovel(payload);

    requisicao.subscribe({
      next: () => {
        this.isSubmitting = false;
        alert(this.idEdicao !== null ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!');
        this.router.navigate(['/lista']);
      },
      error: (erro) => {
        this.isSubmitting = false;
        const payloadErro = extractApiErrorPayload(erro);
        let possuiErroPorCampo = false;

        Object.entries(payloadErro.errors ?? {}).forEach(([campo, mensagem]) => {
          if (this.isImovelField(campo)) {
            this.apiFieldErrors[campo] = mensagem;
            this.imovelForm.controls[campo].markAsTouched();
            possuiErroPorCampo = true;
          }
        });

        if (!possuiErroPorCampo) {
          this.mensagemErroGeral = payloadErro.message ?? 'Erro ao salvar imóvel.';
        }
      }
    });
  }

  clearFieldError(field: ImovelField): void {
    delete this.apiFieldErrors[field];
  }

  onValorInput(): void {
    const valorControl = this.imovelForm.controls.valor;
    const valorFormatado = formatCurrencyInput(valorControl.value);

    if (valorFormatado !== valorControl.value) {
      valorControl.setValue(valorFormatado, { emitEvent: false });
    }

    this.clearFieldError('valor');
  }

  getErrorMessage(field: ImovelField): string | null {
    if (this.apiFieldErrors[field]) {
      return this.apiFieldErrors[field] ?? null;
    }

    const control = this.imovelForm.controls[field];
    if (!(control.touched || this.submitted) || !control.errors) {
      return null;
    }

    if (control.errors['required']) {
      const requiredMessages: Record<ImovelField, string> = {
        titulo: 'Título obrigatório.',
        endereco: 'Endereço obrigatório.',
        bairro: 'Bairro obrigatório.',
        zona: 'Zona obrigatória.',
        valor: 'Valor obrigatório.'
      };

      return requiredMessages[field];
    }

    if (field === 'valor' && control.errors['minValor']) {
      return 'O valor deve ser maior que zero.';
    }

    if (field === 'valor' && control.errors['valorInvalido']) {
      return 'Informe um valor válido no formato 1.500,50.';
    }

    return null;
  }

  private isImovelField(field: string): field is ImovelField {
    return imovelFields.includes(field as ImovelField);
  }
}

function valorMonetarioValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value ?? '';
  if (!value.trim()) {
    return null;
  }

  const valor = parseCurrencyInput(value);
  if (valor === null) {
    return { valorInvalido: true };
  }

  if (valor <= 0) {
    return { minValor: true };
  }

  return null;
}
