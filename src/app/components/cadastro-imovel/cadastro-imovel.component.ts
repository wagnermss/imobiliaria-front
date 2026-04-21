import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImovelService } from '../../services/imovel.service';
import { Imovel } from '../../models/imovel';

@Component({
  selector: 'app-cadastro-imovel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-imovel.component.html'
})
export class CadastroImovelComponent implements OnInit {
  imovel: Imovel = { titulo: '', endereco: '', bairro: '', zona: '', valor: 0 };
  idEdicao: number | null = null;

  constructor(
    private imovelService: ImovelService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idEdicao = Number(idParam);
      this.imovelService.buscarPorId(this.idEdicao).subscribe(dados => {
        this.imovel = dados;
      });
    }
  }

  salvar(): void {
    if (this.idEdicao) {
      this.imovelService.atualizarImovel(this.idEdicao, this.imovel).subscribe(() => {
        alert('Imóvel atualizado com sucesso!');
        this.router.navigate(['/lista']);
      });
    } else {
      this.imovelService.cadastrarImovel(this.imovel).subscribe(() => {
        alert('Imóvel cadastrado com sucesso!');
        this.router.navigate(['/lista']);
      });
    }
  }
}