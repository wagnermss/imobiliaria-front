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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credenciais: LoginPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/login`, credenciais);
  }

  cadastrarUsuario(usuario: CadastroUsuarioPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/register`, usuario);
  }
}
