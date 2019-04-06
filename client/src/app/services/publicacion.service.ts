import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Publicacion } from '../models/publicacion';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  agregarPublicacion(token, publicacion): Observable<any> {
    const params = JSON.stringify(publicacion);
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'publicacion', params, {headers: headers});
  }

  obtenerPublicaciones(token, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'publicaciones/' + pagina, {headers: headers});
  }

  obtenerPublicacionesUsuario(token, idUsuario, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'publicacionesUsuario/' + idUsuario + '/' + pagina, {headers: headers});
  }

  eliminarPublicacion(token, idPublicacion): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'publicacion/' + idPublicacion, {headers: headers});
  }
}
