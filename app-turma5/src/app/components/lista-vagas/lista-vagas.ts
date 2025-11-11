import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { VagaService } from '../../services/vaga-service';

import { GestorService } from '../../services/gestor-service';

import { DepartamentoService } from '../../services/departamento-service';

import { PedidoVaga } from '../../models/pedido-vaga';

import { TipoGestor } from '../../models/tipo-gestor';

import { TipoDepartamento } from '../../models/tipo-departamento';

@Component({
  selector: 'app-lista-vagas',
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-vagas.html',
  styleUrl: './lista-vagas.scss',
})
export class ListaVagas implements OnInit {

  pedidoVaga: WritableSignal<PedidoVaga[]> = signal([]);

  gestores: WritableSignal<TipoGestor[]> = signal([]);

  departamento: WritableSignal<TipoDepartamento[]> = signal([]);

  constructor(
    private VagaService: VagaService,
    private GestorService: GestorService,
    private DepartamentoService: DepartamentoService,
    private router: Router
  ) { };

  ngOnInit(): void {
    this.carregarVagas()
    this.carregarGestores()
    this.carregaDepartamentos()
  }

  carregarVagas(): void {
    this.VagaService.getPedidosVagas().subscribe({
      next: data => {
        console.log(data);
        this.pedidoVaga.set(data);
      }, error: error => {
        console.log(error);
      }
    });
  }

  deletarVaga(item: PedidoVaga): void {
    const confirmar = confirm(`Deseja excluir essa vaga "${item.titulo}"?`);
    if (!confirmar) return;
    
    if (!item.id || item.id === '') {
      alert('Erro: Vaga sem ID. Não é possível excluir.');
      console.error('Vaga sem ID:', item);
      return;
    }
    
    this.VagaService.deletaVaga(item.id).subscribe({
      next: () => {
        alert(`Vaga "${item.titulo}" excluída com sucesso!`);
        this.carregarVagas();
      },
      error: error => {
        console.error('Erro ao excluir vaga:', error);
        alert('Não foi possível excluir a vaga.');
      }
    });
  }

  editarVaga(item: PedidoVaga): void {
    // Se tiver ID, usa o ID. Caso contrário, passa os dados completos via state
    if (item.id && item.id !== '') {
      this.router.navigate(['/form-vaga'], { queryParams: { id: item.id } });
    } else {
      // Passa os dados completos da vaga via state para edição
      this.router.navigate(['/form-vaga'], { 
        state: { vagaParaEditar: item },
        queryParams: { edit: 'true' }
      });
    }
  }

  carregarGestores(): void {
    this.GestorService.getGestores().subscribe({
      next: respGest => {
        this.gestores.set(respGest)
      },
      error: error => {
        console.log(error)
      }
    })
  }

  carregaDepartamentos(): void {
    this.DepartamentoService.getDepartamentos().subscribe({
      next: respDpto2 => {
        this.departamento.set(respDpto2)
      },
      error: error => {
        console.log(error)
      }
    })
  }

  converteData(iso: string): string {
    let d = new Date(iso)
    return d.toLocaleDateString('pt-br');
  }

  buscaGestor(id: string): string {
    let gestorEncontrado = this.gestores().find(g => g.id == id);
    if (gestorEncontrado) {
      return gestorEncontrado.nome
    } else {
      return 'N/A'
    }
  }

  buscaDepartamento(id: string): TipoDepartamento | { departamento: string } {
    let departamentoEncontrado = this.departamento().find(d => d.id == id);
    if (departamentoEncontrado) {
      return departamentoEncontrado;
    } else {
      return { departamento: 'N/A' };
    }
  }
};


