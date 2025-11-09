import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoGestor } from '../models/tipo-gestor';

@Injectable({
  providedIn: 'root',
})
export class GestorService {

  private http = inject(HttpClient);
  private readonly urlBase: string = 'http://localhost:3000/gestor';

  getGestorService(): Observable<TipoGestor[]>{
    return this.http.get<TipoGestor[]>(this.urlBase);
  }

  getGestorPorId(id: string): Observable<TipoGestor>{
    return this.http.get<TipoGestor>(this.urlBase + id);
  }

  getGestorPorNome(nome: string): Observable<TipoGestor[]> {
    const url = `${this.urlBase}?nome=${encodeURIComponent(nome)}`;
    return this.http.get<TipoGestor[]>(url);
  }

  updateGestor(nome: string, gestorId: TipoGestor):Observable<TipoGestor>{
    return this.http.put<TipoGestor>(`${this.urlBase}/${nome}`, gestorId);
  }
}
