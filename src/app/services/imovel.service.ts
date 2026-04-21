import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imovel } from '../models/imovel';

@Injectable({
  providedIn: 'root'
})
export class ImovelService {
  private apiUrl = 'http://localhost:8080/api/imoveis';

  constructor(private http: HttpClient) {}

  listarImoveis(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Imovel> {
    return this.http.get<Imovel>(`${this.apiUrl}/${id}`);
  }

  cadastrarImovel(imovel: Imovel): Observable<Imovel> {
    return this.http.post<Imovel>(this.apiUrl, imovel);
  }

  atualizarImovel(id: number, imovel: Imovel): Observable<Imovel> {
    return this.http.put<Imovel>(`${this.apiUrl}/${id}`, imovel);
  }

  excluirImovel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}