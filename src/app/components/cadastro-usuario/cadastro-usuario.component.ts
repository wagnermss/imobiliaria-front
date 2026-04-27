
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
 selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './cadastro-usuario.component.html'
})
export class CadastroUsuarioComponent {
  novoUsuario = { nome: '', endereco: '', celular: '', email: '', senha: '' };

  constructor(private authService: AuthService, private router: Router) {}

  cadastrar() {
    this.authService.cadastrarUsuario(this.novoUsuario).subscribe({
      next: () => {
        alert('Usuário cadastrado com sucesso!');
        this.router.navigate(['/login']); 
      },
      error: (erro) => {
        alert('Erro ao cadastrar usuário.');
        console.error(erro);
      }
    });
  }
  voltar() {
    this.router.navigate(['/login']);
  }
  
}