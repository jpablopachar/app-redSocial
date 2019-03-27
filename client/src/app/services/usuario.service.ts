import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public url: string;
  public identidad;
  public token;
  public estadisticas;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  registrar(usuario: Usuario): Observable<any> {
    const params = JSON.stringify(usuario);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'registrarse', params, {headers: headers});
  }

  iniciarSesion(usuario, obtenerToken = null): Observable<any> {
    if (obtenerToken != null) {
      usuario.obtenerToken = obtenerToken;
    }

    const params = JSON.stringify(usuario);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'iniciarSesion', params, {headers: headers});
  }

  obtenerIdentidad() {
    const identidad = JSON.parse(localStorage.getItem('identidad'));

    if (identidad !== 'undefined') {
      this.identidad = identidad;
    } else {
      this.identidad = null;
    }

    return this.identidad;
  }

  obtenerToken() {
    const token = localStorage.getItem('token');

    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

  obtenerEstadisticas() {
    const estadisticas = JSON.parse(localStorage.getItem('estadisticas'));

    if (estadisticas !== 'undefined') {
      this.estadisticas = estadisticas;
    } else {
      this.estadisticas = null;
    }

    return this.estadisticas;
  }

  obtenerContadores(idUsuario = null): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', this.obtenerToken());

    if (idUsuario !== null) {
      return this._http.get(this.url + 'contadores/' + idUsuario, {headers: headers});
    } else {
      return this._http.get(this.url + 'contadores/', {headers: headers});
    }
  }
}
