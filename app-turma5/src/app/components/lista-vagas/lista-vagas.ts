import { Component, OnInit, signal, WritableSignal } from '@angular/core';

import { VagaService } from '../../services/vaga-service';

import { GestorService } from '../../services/gestor-service';

import { DepartamentoService } from '../../services/departamento-service';

import { PedidoVaga } from '../../models/pedido-vaga';

import { TipoGestor } from '../../models/tipo-gestor';

import { TipoDepartamento } from '../../models/tipo-departamento';

@Component({
  selector: 'app-lista-vagas',
  imports: [],
  templateUrl: './lista-vagas.html',
  styleUrl: './lista-vagas.scss',
})
export class ListaVagas implements OnInit {

  contador: WritableSignal<number> = signal(0);

  nomes: string[] = [];

  pedidoVaga: WritableSignal<PedidoVaga[]> = signal([]);

  gestores: WritableSignal<TipoGestor[]> = signal([]);

  departamentos: WritableSignal<TipoDepartamento[]> = signal([]);

  constructor(
    private VagaService: VagaService,
    private GestorService: GestorService,
    private DepartamentoService: DepartamentoService
  ) { };

  ngOnInit(): void {
    this.carregarPedidos()
    this.carregarGestores()
    this.carregarDepartamentos()
  }

  add(): void {
    this.contador.update(valorAntigo => valorAntigo + 1);
  }

  carregarPedidos(): void {
    this.VagaService.getPedidosVagas().subscribe({
      next: data => {
        console.log(data);
        this.pedidoVaga.set(data);
      }, error: error => {
        console.log(error);
      }
    });
  }

  carregarGestores(): void {
    this.GestorService.getGestorService().subscribe({
      next: respostaGestores => {
        this.gestores.set(respostaGestores);
      }, error: error => {
        console.log(error);
      }
    })
  }

  carregarDepartamentos(): void{
    this.DepartamentoService.getDepartamento().subscribe({
      next: respostaDepartamentos => {
        this.departamentos.set(respostaDepartamentos);
      }, error: error => {
        console.log(error);
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

  buscaDepartamento(id: string): any{
    let departamentoEncontrado = this.departamentos().find(d => d.id == id);
    if (departamentoEncontrado) {
      return departamentoEncontrado;
    } else {
      return { nome: 'N/A', id: '', descricao: ''};
    }
  }
}


