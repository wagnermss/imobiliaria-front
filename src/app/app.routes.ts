import { Routes } from '@angular/router';
import { CadastroImovelComponent } from './components/cadastro-imovel/cadastro-imovel.component';
import { ListaImoveisComponent } from './components/lista-imoveis/lista-imoveis.component';

export const routes: Routes = [
 
  { path: '', redirectTo: '/lista', pathMatch: 'full' },
  { path: 'lista', component: ListaImoveisComponent },
  { path: 'cadastro', component: CadastroImovelComponent }, 
  { path: 'editar/:id', component: CadastroImovelComponent }
];