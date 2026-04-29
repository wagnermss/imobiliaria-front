import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface CadastroUsuarioPayload {
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface UsuarioSessao {
  id?: number | string;
  nome?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  token?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly sessionStorageKey = 'usuario';

  constructor(private http: HttpClient) {}

  login(credenciais: LoginPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/login`, credenciais);
  }

  cadastrarUsuario(usuario: CadastroUsuarioPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/register`, usuario);
  }

  salvarSessao(payload: unknown, fallback: Partial<UsuarioSessao> = {}): void {
    const usuarioNormalizado = normalizarUsuarioSessao(payload, fallback);
    localStorage.setItem(this.sessionStorageKey, JSON.stringify(usuarioNormalizado));
  }

  getUsuarioAtual(): UsuarioSessao | null {
    const rawSession = localStorage.getItem(this.sessionStorageKey);
    if (!rawSession) {
      return null;
    }

    try {
      return normalizarUsuarioSessao(JSON.parse(rawSession));
    } catch {
      return null;
    }
  }

  atualizarUsuarioLocal(dados: Partial<UsuarioSessao>): UsuarioSessao | null {
    const usuarioAtual = this.getUsuarioAtual();
    if (!usuarioAtual) {
      return null;
    }

    const usuarioAtualizado = normalizarUsuarioSessao({
      ...usuarioAtual,
      ...dados
    });

    localStorage.setItem(this.sessionStorageKey, JSON.stringify(usuarioAtualizado));
    return usuarioAtualizado;
  }

  temSessao(): boolean {
    return !!this.getUsuarioAtual();
  }

  logout(): void {
    localStorage.removeItem(this.sessionStorageKey);
  }
}

function normalizarUsuarioSessao(
  payload: unknown,
  fallback: Partial<UsuarioSessao> = {}
): UsuarioSessao {
  const usuarioBase = extrairUsuario(payload);

  return {
    ...fallback,
    ...usuarioBase,
    id: usuarioBase.id ?? fallback.id,
    nome: firstString(usuarioBase.nome, fallback.nome),
    endereco: firstString(usuarioBase.endereco, fallback.endereco),
    telefone: firstString(usuarioBase.telefone, fallback.telefone),
    email: firstString(usuarioBase.email, fallback.email),
    token: firstString(usuarioBase.token, fallback.token)
  };
}

function extrairUsuario(payload: unknown): UsuarioSessao {
  if (typeof payload === 'string') {
    return { token: payload };
  }

  if (!isRecord(payload)) {
    return {};
  }

  const nestedUsuario = isRecord(payload['usuario']) ? payload['usuario'] : {};

  return {
    ...nestedUsuario,
    ...payload
  };
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value) => typeof value === 'string' && value.trim()) as string | undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
