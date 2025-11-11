import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoVaga } from '../models/pedido-vaga';

@Injectable({
  providedIn: 'root',
})
export class VagaService {


  private http = inject(HttpClient);
  private readonly urlBase: string = 'http://localhost:3000/vagas/';

  getPedidosVagas(): Observable<PedidoVaga[]>{
    return this.http.get<PedidoVaga[]>(this.urlBase);
  }

  getPedidosPorId(id: string):Observable<PedidoVaga>{
    return this.http.get<PedidoVaga>(this.urlBase + id); 
  }

  postCriaVaga(vaga: PedidoVaga): Observable<PedidoVaga>{
    return this.http.post<PedidoVaga>(this.urlBase, vaga);
  }

  deletaVaga(id: string): Observable<void>{
    return this.http.delete<void>(`http://localhost:3000/vagas/${id}`);
  }

  atualizaVaga(id: string, vaga: PedidoVaga): Observable<PedidoVaga>{
    return this.http.put<PedidoVaga>(this.urlBase + id, vaga);
  }
}
