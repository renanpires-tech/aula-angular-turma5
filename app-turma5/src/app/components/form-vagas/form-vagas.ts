import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { VagaService } from '../../services/vaga-service';
import { GestorService } from '../../services/gestor-service';
import { DepartamentoService } from '../../services/departamento-service';
import { PedidoVaga } from '../../models/pedido-vaga';
import { TipoGestor } from '../../models/tipo-gestor';
import { TipoDepartamento } from '../../models/tipo-departamento';

@Component({
  selector: 'app-form-vagas',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form-vagas.html',
  styleUrl: './form-vagas.scss',
})
export class FormVagas implements OnInit {

  pedidoVaga: WritableSignal<PedidoVaga[]> = signal([]);
  gestores: WritableSignal<TipoGestor[]> = signal([]);
  departamento: WritableSignal<TipoDepartamento[]> = signal([]);
  
  // Propriedades do formulário
  nomeTitulo: string = '';
  nomeMotivo: string = '';
  nomeRequisito: string = '';
  requisitos: string[] = [];
  nomeQuantidade: string = '1';
  nomeAprovacao: string = 'Pendente';
  gestorId: string = '';
  departamentoId: string = '';
  nomeData: string = '';
  nomeID: string = '';
  
  mostrarFormulario: boolean = false;
  isEditMode: boolean = false;
  vagaId: string = '';
  vagaOriginal: PedidoVaga | null = null;

  constructor(
    private VagaService: VagaService,
    private GestorService: GestorService,
    private DepartamentoService: DepartamentoService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.carregarVagas();
    this.carregarGestores();
    this.carregaDepartamentos();
    
    // Verifica se há dados para edição (via state ou query params)
    const state = history.state as { vagaParaEditar?: PedidoVaga };
    
    if (state?.vagaParaEditar) {
      // Edição via state (quando não tem ID)
      this.isEditMode = true;
      this.mostrarFormulario = true;
      // Guarda a vaga original para poder identificá-la depois
      this.vagaOriginal = { ...state.vagaParaEditar };
      this.preencherFormulario(state.vagaParaEditar);
      // Limpa o state após usar
      history.replaceState({}, '');
    } else {
      // Verifica se há ID na query string para edição
      this.route.queryParams.subscribe(params => {
        if (params['id']) {
          this.vagaId = params['id'];
          this.isEditMode = true;
          this.mostrarFormulario = true;
          this.carregarVagaParaEdicao(this.vagaId);
        } else {
          this.mostrarFormulario = false;
        }
      });
    }
  }

  carregarVagaParaEdicao(id: string): void {
    this.VagaService.getPedidosPorId(id).subscribe({
      next: vaga => {
        this.preencherFormulario(vaga);
      },
      error: error => {
        console.error('Erro ao carregar vaga para edição:', error);
        alert('Não foi possível carregar a vaga para edição.');
        this.router.navigate(['/']);
      }
    });
  }

  preencherFormulario(vaga: PedidoVaga): void {
    this.nomeID = vaga.id || '';
    this.nomeTitulo = vaga.titulo;
    this.nomeMotivo = vaga.motivo;
    this.requisitos = [...vaga.requisitos];
    this.nomeQuantidade = vaga.quantidade.toString();
    this.nomeAprovacao = vaga.aprovacao;
    this.gestorId = vaga.gestorId;
    this.departamentoId = vaga.departamentoId || '';
    
    // Converte data ISO para datetime-local
    if (vaga.dataSolicitacao) {
      const data = new Date(vaga.dataSolicitacao);
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const dia = String(data.getDate()).padStart(2, '0');
      const horas = String(data.getHours()).padStart(2, '0');
      const minutos = String(data.getMinutes()).padStart(2, '0');
      this.nomeData = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
    } else {
      this.nomeData = '';
    }
    this.nomeRequisito = '';
  }

  carregarVagas(): void {
    this.VagaService.getPedidosVagas().subscribe({
      next: data => {
        console.log(data);
        this.pedidoVaga.set(data);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  carregarGestores(): void {
    this.GestorService.getGestores().subscribe({
      next: respGest => {
        this.gestores.set(respGest);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  carregaDepartamentos(): void {
    this.DepartamentoService.getDepartamentos().subscribe({
      next: respDpto => {
        this.departamento.set(respDpto);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  adicionarRequisito(): void {
    if (this.nomeRequisito.trim()) {
      this.requisitos.push(this.nomeRequisito.trim());
      this.nomeRequisito = '';
    }
  }

  removerRequisito(index: number): void {
    this.requisitos.splice(index, 1);
  }

  converteData(iso: string): string {
    let d = new Date(iso);
    return d.toLocaleDateString('pt-br');
  }

  buscaGestor(id: string): string {
    let gestorEncontrado = this.gestores().find(g => g.id == id);
    if (gestorEncontrado) {
      return gestorEncontrado.nome;
    } else {
      return 'N/A';
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

  abrirFormulario(): void {
    this.isEditMode = false;
    this.vagaId = '';
    this.vagaOriginal = null;
    this.limparFormulario();
    this.mostrarFormulario = true;
  }

  limparFormulario(): void {
    this.nomeID = '';
    this.nomeTitulo = '';
    this.nomeMotivo = '';
    this.nomeRequisito = '';
    this.requisitos = [];
    this.nomeQuantidade = '1';
    this.nomeAprovacao = 'Pendente';
    this.gestorId = '';
    this.departamentoId = '';
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    this.nomeData = `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  fecharFormulario(): void {
    this.mostrarFormulario = false;
    this.isEditMode = false;
    this.vagaId = '';
    this.vagaOriginal = null;
    this.limparFormulario();
  }

  criarVagas(): void {
    // Constrói o objeto vagaNova a partir dos campos do formulário
    const dataISO = this.nomeData ? new Date(this.nomeData).toISOString() : new Date().toISOString();
    
    const vagaParaEnviar: PedidoVaga = {
      id: this.nomeID || '',
      titulo: this.nomeTitulo,
      gestorId: this.gestorId,
      departamentoId: this.departamentoId,
      quantidade: parseInt(this.nomeQuantidade) as 0 | 1 | 2 | 3 | 4 | 5,
      motivo: this.nomeMotivo,
      requisitos: [...this.requisitos],
      aprovacao: this.nomeAprovacao as 'Pendente' | 'Aprovado' | 'Reprovado',
      dataSolicitacao: dataISO
    };

    if (this.isEditMode) {
      if (this.vagaId && this.vagaId !== '') {
        // Atualiza vaga que tem ID
        this.VagaService.atualizaVaga(this.vagaId, vagaParaEnviar).subscribe({
          next: vagaAtualizada => {
            alert('Vaga atualizada com sucesso!');
            this.router.navigate(['/']);
          },
          error: erro => {
            console.error('Erro ao atualizar vaga:', erro);
            alert('Não foi possível atualizar a vaga.');
          }
        });
      } else if (this.vagaOriginal) {
        // Se não tem ID mas temos a vaga original, atualiza sem ID
        this.atualizarVagaSemId(vagaParaEnviar);
      } else {
        // Fallback: cria nova vaga
        this.VagaService.postCriaVaga(vagaParaEnviar).subscribe({
          next: vagaCriada => {
            alert('Nova vaga criada com sucesso!');
            this.router.navigate(['/']);
          },
          error: erro => {
            console.error('Erro ao criar vaga:', erro);
            alert('Não foi possível criar a vaga.');
          }
        });
      }
    } else {
      this.VagaService.postCriaVaga(vagaParaEnviar).subscribe({
        next: vagaCriada => {
          alert('Vaga criada com sucesso!');
          this.fecharFormulario();
          this.carregarVagas();
        },
        error: erro => {
          console.error('Erro ao criar vaga:', erro);
          alert('Não foi possível criar a vaga.');
        }
      });
    }
  }

  atualizarVagaSemId(vagaParaEnviar: PedidoVaga): void {
    // Primeiro cria a nova vaga com os dados atualizados
    this.VagaService.postCriaVaga(vagaParaEnviar).subscribe({
      next: vagaCriada => {
        // Tenta encontrar e remover a vaga antiga da lista local
        const vagasAtuais = this.pedidoVaga();
        const vagaAntigaIndex = vagasAtuais.findIndex(v => 
          v.titulo === this.vagaOriginal?.titulo && 
          v.dataSolicitacao === this.vagaOriginal?.dataSolicitacao &&
          v.gestorId === this.vagaOriginal?.gestorId &&
          (!v.id || v.id === '')
        );
        
        if (vagaAntigaIndex !== -1) {
          // Remove a vaga antiga da lista local
          const novasVagas = [...vagasAtuais];
          novasVagas.splice(vagaAntigaIndex, 1);
          this.pedidoVaga.set(novasVagas);
        }
        
        // Recarrega a lista do servidor para garantir sincronização
        this.carregarVagas();
        alert('Vaga atualizada com sucesso!');
        this.router.navigate(['/']);
      },
      error: erro => {
        console.error('Erro ao criar vaga atualizada:', erro);
        alert('Não foi possível atualizar a vaga.');
      }
    });
  }
}

