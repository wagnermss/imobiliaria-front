import { Routes } from '@angular/router';
import { CadastroImovelComponent } from './components/cadastro-imovel/cadastro-imovel.component';
import { ListaImoveisComponent } from './components/lista-imoveis/lista-imoveis.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'lista', component: ListaImoveisComponent },
  { path: 'cadastro', component: CadastroImovelComponent },
  { path: 'editar/:id', component: CadastroImovelComponent }
];