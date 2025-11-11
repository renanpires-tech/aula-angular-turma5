import { Component, OnInit } from '@angular/core';
import { DepartamentoService } from '../../services/departamento-service';
import { TipoDepartamento } from '../../models/tipo-departamento';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-departamentos',
  imports: [FormsModule, CommonModule],
  templateUrl: './lista-departamentos.html',
  styleUrls: ['./lista-departamentos.scss'],
})
export class ListaDepartamentos implements OnInit {

  nomeCategoria: string = '';
  departamentos: TipoDepartamento[] = [];

  constructor(
    private apiDpto: DepartamentoService) {}

  ngOnInit(): void {
    this.carregarDepartamentos();
  }

  carregarDepartamentos(): void {
    this.apiDpto.getDepartamentos().subscribe({
      next: (dados) => {
        this.departamentos = dados;
        console.log('Departamentos carregados:', dados);
      },
      error: erro => {
        console.error('Erro ao carregar departamentos:', erro);
      }
    });
  };


  criarDepartamento(): void {
    let objParaEnviar: TipoDepartamento = {
      departamento: this.nomeCategoria
    }
    this.apiDpto.postCriarDepartamento(objParaEnviar).subscribe({
      next: itemCriado => {
        console.log(itemCriado);
        alert('Departamento Criado!');
        this.carregarDepartamentos();
      }, 
      error: error => {
        console.log(error);
      }
    });
  }
};


