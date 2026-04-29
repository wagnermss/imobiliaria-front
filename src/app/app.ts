import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService, UsuarioSessao } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    AvatarModule,
    ButtonModule,
    CardModule,
    DividerModule,
    DrawerModule,
    MenuModule,
    ToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  sidebarVisible = false;
  readonly drawerStyle = { width: '21rem' };

  get showShell(): boolean {
    return this.authService.temSessao() && !this.isPublicRoute(this.currentRoute);
  }

  get navigationItems(): MenuItem[] {
    return [
      {
        label: 'Catálogo de Imóveis',
        icon: 'pi pi-list',
        styleClass: this.isCatalogRoute() ? 'is-active-route' : '',
        command: () => this.navigateTo('/lista')
      },
      {
        label: 'Cadastrar Imóvel',
        icon: 'pi pi-plus-circle',
        styleClass: this.isImovelFormRoute() ? 'is-active-route is-accent-route' : 'is-accent-route',
        command: () => this.navigateTo('/cadastro')
      }
    ];
  }

  get accountMenuItems(): MenuItem[] {
    return [
      {
        label: 'Alterar dados',
        icon: 'pi pi-user-edit',
        styleClass: this.isMinhaContaRoute() ? 'is-active-route' : '',
        command: () => this.navigateTo('/minha-conta')
      }
    ];
  }

  get currentSectionTitle(): string {
    if (this.currentRoute.startsWith('/cadastro')) {
      return 'Cadastrar Imóvel';
    }

    if (this.currentRoute.startsWith('/editar')) {
      return 'Editar Imóvel';
    }

    if (this.currentRoute.startsWith('/minha-conta')) {
      return 'Minha Conta';
    }

    return 'Catálogo de Imóveis';
  }

  get usuarioAtual(): UsuarioSessao | null {
    return this.authService.getUsuarioAtual();
  }

  get usuarioNome(): string {
    return this.usuarioAtual?.nome?.trim() || 'Minha conta';
  }

  get usuarioEmail(): string {
    return this.usuarioAtual?.email?.trim() || 'Atualize seus dados';
  }

  get usuarioInicial(): string {
    return this.usuarioNome.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateTo(route: string): void {
    this.sidebarVisible = false;
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.sidebarVisible = false;
    this.router.navigate(['/login']);
  }

  isCatalogRoute(): boolean {
    return this.currentRoute.startsWith('/lista');
  }

  isImovelFormRoute(): boolean {
    return this.currentRoute.startsWith('/cadastro') || this.currentRoute.startsWith('/editar');
  }

  isMinhaContaRoute(): boolean {
    return this.currentRoute.startsWith('/minha-conta');
  }

  private get currentRoute(): string {
    return this.router.url.split('?')[0];
  }

  private isPublicRoute(route: string): boolean {
    return route === '/login' || route === '/cadastro-usuario';
  }
}
