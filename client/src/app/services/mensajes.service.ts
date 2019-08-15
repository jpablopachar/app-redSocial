import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  agregarMensaje(token, mensaje): Observable<any> {
    const params = JSON.stringify(mensaje);
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.post(this.url + 'mensaje', params, {headers: headers});
  }

  obtenerMensajesRecibidos(token, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'misMensajes/' + pagina, {headers: headers});
  }

  obtenerMensajesEnviados(token, pagina = 1): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

    return this._http.get(this.url + 'mensajes/' + pagina, {headers: headers});
  }
}
