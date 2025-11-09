import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDepartamento } from '../models/tipo-departamento';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {

  private http2 = inject(HttpClient);
  private readonly urlBase2: string = 'http://localhost:3000/departamento';

  getDepartamento(): Observable<TipoDepartamento[]> {
    return this.http2.get<TipoDepartamento[]>(this.urlBase2);
  }

  getDepartamentoPorId(id: string): Observable<TipoDepartamento> {
    return this.http2.get<TipoDepartamento>(this.urlBase2 + id);
  }

  updateDepartamento(nome: string, departamentoId: TipoDepartamento): Observable<TipoDepartamento> {
    return this.http2.put<TipoDepartamento>(`${this.urlBase2}/${nome}`, departamentoId);
  }
}
