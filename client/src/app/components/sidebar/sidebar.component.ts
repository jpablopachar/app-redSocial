import { Component, OnInit } from '@angular/core';

import { GLOBAL } from 'src/app/services/global';
import { Publicacion } from './../../models/publicacion';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public identidad;
  public token;
  public estadisticas;
  public url;
  public estado;
  public publicacion: Publicacion;

  constructor(private _usuarioService: UsuarioService) {
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    this.estadisticas = this._usuarioService.obtenerEstadisticas();
    this.url = GLOBAL.url;
    this.publicacion = new Publicacion('', this.identidad._id, '', '', '');
  }

  ngOnInit() {
    console.log('¡Componente sidebar cargado!');
  }

  onSubmit() {
    console.log(this.publicacion);
  }
}
