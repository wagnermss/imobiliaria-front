import { Routes } from '@angular/router';
import { CadastroImovelComponent } from './components/cadastro-imovel/cadastro-imovel.component';
import { ListaImoveisComponent } from './components/lista-imoveis/lista-imoveis.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroUsuarioComponent } from './components/cadastro-usuario/cadastro-usuario.component';
import { MinhaContaComponent } from './components/minha-conta/minha-conta.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'lista', component: ListaImoveisComponent, canActivate: [authGuard] },
  { path: 'cadastro', component: CadastroImovelComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: CadastroImovelComponent, canActivate: [authGuard] },
  { path: 'minha-conta', component: MinhaContaComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
