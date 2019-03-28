import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './services/global';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioService]
})
export class AppComponent implements OnInit, DoCheck {
  public titulo: string;
  public identidad;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService) {
    this.titulo = 'APP RED SOCIAL';
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identidad = this._usuarioService.obtenerIdentidad();
    console.log(this.identidad);
  }

  // Actualiza el valor de identidad de forma dinámica
  ngDoCheck() {
    this.identidad = this._usuarioService.obtenerIdentidad();
  }

  cerrarSesion() {
    localStorage.clear();

    this.identidad = null;

    this._router.navigate(['/']);
  }
}
