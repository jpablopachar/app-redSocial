import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Usuario } from 'src/app/models/usuario';
import { Publicacion } from './../../models/publicacion';
import { Seguimiento } from './../../models/seguimiento';
import { UsuarioService } from './../../services/usuario.service';
import { SeguimientoService } from './../../services/seguimiento.service';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  providers: [UsuarioService, SeguimientoService]
})
export class PerfilComponent implements OnInit {
  public titulo: string;
  public usuario: Usuario;
  public estadisticas: string;
  public identidad;
  public token;
  public estado;
  public url;
  public seguido;
  public seguidor;
  public seguirUsuarioHover;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _seguimientoService: SeguimientoService) {
      this.titulo = 'Perfil';
      this.identidad = this._usuarioService.obtenerIdentidad();
      this.token = this._usuarioService.obtenerToken();
      this.url = GLOBAL.url;
    }

  ngOnInit() {
    console.log('¡Componente perfil cargado!');
    this.cargarPagina();
  }

  cargarPagina() {
    this._route.params.subscribe((params) => {
      const idUsuario = params['idUsuario'];

      this.obtenerUsuario(idUsuario);
      this.obtenerContadores(idUsuario);
    });
  }

  obtenerUsuario(idUsuario) {
    this._usuarioService.obtenerUsuario(idUsuario).subscribe((res) => {
      if (!res.usuario) {
        this.estado = 'error';
      } else {
        this.usuario = res.usuario;

        if (res.seguidor && res.seguidor._id) {
          this.seguidor = true;
        } else {
          this.seguidor = false;
        }

        if (res.seguido && res.seguido._id) {
          this.seguido = true;
        } else {
          this.seguido = false;
        }
      }
    }, (error) => {
      console.log(<any>error);
      this._router.navigate(['/perfil', this.identidad._id]);
    });
  }

  obtenerContadores(idUsuario) {
    this._usuarioService.obtenerContadores(idUsuario).subscribe((res) => {
      this.estadisticas = res;
    }, error => console.log(<any>error));
  }

  seguirUsuario(seguido) {
    const seguimiento = {
      '_id': '',
      'usuario': this.identidad._id,
      'seguido': seguido,
    };

    this._seguimientoService.seguirUsuario(this.token, seguimiento).subscribe(res => this.seguido = true,
      error => console.log(<any>error));
  }

  dejarDeSeguir(seguido) {
    this._seguimientoService.dejarDeSeguir(this.token, seguido).subscribe(res => this.seguido = false,
      error => console.log(<any>error));
  }

  mouseEnter(idUsuario) {
    this.seguirUsuarioHover = idUsuario;
  }

  mouseLeave() {
    this.seguirUsuarioHover = 0;
  }
}
