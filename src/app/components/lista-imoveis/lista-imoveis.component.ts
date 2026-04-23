import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { ImovelService } from '../../services/imovel.service';
import { Imovel } from '../../models/imovel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-lista-imoveis',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule], 
  templateUrl: './lista-imoveis.component.html'
})
export class ListaImoveisComponent implements OnInit {
  imoveis: Imovel[] = [];

  constructor(private imovelService: ImovelService) {}

  ngOnInit(): void {
    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.imovelService.listarImoveis().subscribe(dados => {
      this.imoveis = dados;
    });
  }

  excluir(id?: number): void {
    if (id && confirm('Tem certeza que deseja excluir este imóvel?')) {
      this.imovelService.excluirImovel(id).subscribe(() => {
        alert('Imóvel excluído!');
        this.carregarImoveis(); 
      });
    }
  }
}