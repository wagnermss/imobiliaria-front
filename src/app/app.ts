import { Component } from '@angular/core';
// Importação do RouterOutlet removida
import { CadastroImovelComponent } from './components/cadastro-imovel/cadastro-imovel.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CadastroImovelComponent], 
  template: `
    <app-cadastro-imovel></app-cadastro-imovel>
  `,
})
export class App { 
  title = 'imobiliaria-front';
}