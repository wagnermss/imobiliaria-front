import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verifica se existe um usuário guardado no navegador
  const usuarioLogado = localStorage.getItem('usuario');

  if (usuarioLogado) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false;
  }
};