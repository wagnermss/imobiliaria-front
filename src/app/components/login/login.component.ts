import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credenciais = { email: '', senha: '' };

  constructor(private authService: AuthService, private router: Router) {}

  fazerLogin() {
    this.authService.login(this.credenciais).subscribe({
      next: (usuario) => {
       localStorage.setItem('usuario', JSON.stringify(usuario));
        this.router.navigate(['/lista']);
      },
      error: (erro) => {
        alert('Falha no login. Verifique seu e-mail e senha.');
        console.error(erro);
      }
    });
  }
}