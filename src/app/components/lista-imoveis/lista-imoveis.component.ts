import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImovelService } from '../../services/imovel.service';
import { Imovel } from '../../models/imovel';

@Component({
  selector: 'app-lista-imoveis',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-imoveis.component.html',
  // styleUrls: ['./lista-imoveis.component.css']
})
export class ListaImoveisComponent implements OnInit {
  imoveis: Imovel[] = [];

  constructor(private imovelService: ImovelService) {}

  
  ngOnInit(): void {
    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.imovelService.listarImoveis().subscribe({
      next: (dados) => {
        this.imoveis = dados; 
      },
      error: (erro) => {
        console.error('Erro ao buscar a lista de imóveis', erro);
      }
    });
  }
}