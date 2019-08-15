import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  seguirUsuario(token, seguimiento): Observable<any> {
    const params = JSON.stringify(seguimiento);
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'seguir', params, {headers: headers});
  }

  dejarDeSeguir(token, idUsuario) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.delete(this.url + 'seguir/' + idUsuario, {headers: headers});
  }

  obtenerSeguidos(token, idUsuario = null, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'siguiendo';

    if (idUsuario != null) {
      url = this.url + 'siguiendo/' + idUsuario + '/' + pagina;
    }

    return this._http.get(url, {headers: headers});
  }

  obtenerSeguidores(token, idUsuario = null, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    let url = this.url + 'seguidores';

    if (idUsuario != null) {
      url = this.url + 'seguidores/' + idUsuario + '/' + pagina;
    }

    return this._http.get(url, {headers: headers});
  }

  obtenerMisSeguidos(token): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'obtenerMisSeguidos/true', {headers: headers});
  }
}
