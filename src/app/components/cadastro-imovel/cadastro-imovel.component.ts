import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImovelService } from '../../services/imovel.service';

@Component({
  selector: 'app-cadastro-imovel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro-imovel.component.html',
  styleUrl: './cadastro-imovel.component.css'
  
})
export class CadastroImovelComponent {
  imovelForm: FormGroup;

  constructor(private fb: FormBuilder, private imovelService: ImovelService) {
    this.imovelForm = this.fb.group({
      titulo: ['', Validators.required],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      zona: ['', Validators.required],
      valor: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.imovelForm.valid) {
      this.imovelService.cadastrarImovel(this.imovelForm.value).subscribe({
        next: (resposta) => {
          alert('Imóvel cadastrado com sucesso!');
          this.imovelForm.reset();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar:', erro);
          alert('Erro ao comunicar com o servidor.');
        }
      });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }
}