import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoGestor } from '../models/tipo-gestor';

@Injectable({
  providedIn: 'root',
})
export class GestorService {
  
  private api = inject(HttpClient)
  private readonly urlBase: string = 'http://localhost:3000/gestor/'

  getGestores(): Observable<TipoGestor[]>{
    return this.api.get<TipoGestor[]>(this.urlBase);
  }

  getGestorPorId(id: string): Observable<TipoGestor>{
    return this.api.get<TipoGestor>(this.urlBase + id);
  }

  postCriaGestor(obj: TipoGestor): Observable<TipoGestor> {
  return this.api.post<TipoGestor>(this.urlBase, obj);
  }

  deletaGestor(id: string): Observable<void>{
    return this.api.delete<void>(`http://localhost:3000/gestores/${id}`);
  }
}
