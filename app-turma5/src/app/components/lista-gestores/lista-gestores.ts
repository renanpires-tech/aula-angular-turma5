import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoGestor } from '../../models/tipo-gestor';
import { GestorService } from '../../services/gestor-service';
import { DepartamentoService } from '../../services/departamento-service';
import { TipoDepartamento } from '../../models/tipo-departamento';

@Component({
  selector: 'app-lista-gestores',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-gestores.html',
  styleUrl: './lista-gestores.scss',
})
export class ListaGestores implements OnInit {

  gestores: WritableSignal<TipoGestor[]> = signal([]);
  dptos: WritableSignal<TipoDepartamento[]> = signal([]);

  gestorNovo: TipoGestor = { 
  nome: '',
  email: '',
  cargo: '',
  departamentoId: '',
}
  constructor(
    private apiGestor: GestorService,
    private apiDpto: DepartamentoService 
  ) { };

  ngOnInit(): void {
    this.carregaDepartamentos();
    this.carregaGestores();
  }

  carregaGestores(): void {
    this.apiGestor.getGestores().subscribe({
      next: respGestores => {
        this.gestores.set(respGestores);
      }, error: error => {
        console.log(error)
      }
    });
  };

  carregaDepartamentos(): void {
    this.apiDpto.getDepartamentos().subscribe({
      next: respDpto => {
        this.dptos.set(respDpto);
      }, error: error => {
        console.log(error)
      }
    });
  };

  criarGestor(): void {
    this.apiGestor.postCriaGestor(this.gestorNovo).subscribe({
      next: gestorCriado => {
        console.log(gestorCriado);
        alert('Gestor criado com sucesso!');
        this.gestorNovo = {
          nome: '',
          email: '',
          cargo: '',
          departamentoId: ''
        };
        this.carregaGestores(); 
      },
      error: erro => {
        console.error('Erro ao criar gestor:', erro);
        alert('Não foi possível criar o gestor.');
      }
    });
  };

  buscaDpto(id: string): string {
    let dptoEncontrado = this.dptos().find(d => d.id === id)
    if (dptoEncontrado) {
      return dptoEncontrado.departamento
    } else {
      return 'N/A'
    }
  };

  deletarGestor(item: TipoGestor): void {
    const confirmar = confirm(`Deseja excluir o gestor "${item.nome}"?`);
    if (!confirmar) return;
    this.apiGestor.deletaGestor(item.id || '').subscribe({
      next: () => {
        alert(`Gestor "${item.nome}" excluído com sucesso!`);
        this.carregaGestores();
      },
      error: error => {
        console.error('Erro ao excluir gestor:', error);
        alert('Não foi possível excluir o gestor.');
      }
    });
  }
};
