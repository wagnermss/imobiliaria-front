import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  
  imports: [RouterOutlet, RouterLink, RouterLinkActive], 
  template: `
    <nav style="background-color: #333; padding: 15px; color: white; margin-bottom: 20px;">
      <h1 style="display: inline; margin-right: 20px;">Imobiliária</h1>
      
      <a routerLink="/lista" routerLinkActive="active" style="color: white; margin-right: 15px; text-decoration: none;">Ver Imóveis</a>
      <a routerLink="/cadastro" routerLinkActive="active" style="color: white; text-decoration: none;">Cadastrar Novo</a>
    </nav>

    <main style="padding: 20px;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App { 
  title = 'imobiliaria-front';
}