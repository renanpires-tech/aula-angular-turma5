import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoVaga } from '../models/pedido-vaga';

@Injectable({
  providedIn: 'root',
})
export class VagaService {

  private http = inject(HttpClient);
  private readonly urlBase: string = 'http://localhost:3000/vagas';

  getPedidosVagas(): Observable<PedidoVaga[]>{
    return this.http.get<PedidoVaga[]>(this.urlBase);
  }

  getPedidosPorId(id: string):Observable<PedidoVaga>{
    return this.http.get<PedidoVaga>(this.urlBase + id); 
  }
}
