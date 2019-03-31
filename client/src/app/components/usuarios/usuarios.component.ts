import { Seguimiento } from './../../models/seguimiento';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguimientoService } from './../../services/seguimiento.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  providers: [UsuarioService, SeguimientoService]
})
export class UsuariosComponent implements OnInit {
  public titulo: string;
  public url: string;
  public identidad;
  public token;
  public pagina;
  public pagina_siguiente;
  public pagina_anterior;
  public total;
  public paginas;
  public usuarios: Usuario[];
  public seguimientos;
  public estado: string;
  public seguimientoUsuarioHover;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _seguimientoService: SeguimientoService) {
    this.titulo = 'Gente';
    this.url = GLOBAL.url;
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
  }

  ngOnInit() {
    console.log('¡Componente usuarios cargado!');
    this.paginaActual();
  }

  paginaActual() {
    this._route.params.subscribe((params) => {
      let pagina = +params['pagina'];

      this.pagina = pagina;

      if (!params['pagina']) {
        pagina = 1;
      }

      if (!pagina) {
        pagina = 1;
      } else {
        this.pagina_siguiente = pagina + 1;
        this.pagina_anterior = pagina - 1;

        if (this.pagina_anterior <= 0) {
          this.pagina_anterior = 1;
        }
      }

      // Devolver listado de usuarios
      this.obtenerUsuarios(pagina);
    }, error => console.log(<any>error));
  }

  obtenerUsuarios(pagina) {
    this._usuarioService.obtenerUsuarios(pagina).subscribe((res) => {
      console.log(res);
      if (!res.usuarios) {
        this.estado = 'error';
      } else {
        this.total = res.total;
        this.usuarios = res.usuarios;
        this.paginas = res.paginas;
        this.seguimientos = res.seguidos;

        if (pagina > this.paginas) {
          this._router.navigate(['/usuarios', 1]);
        }
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError != null) {
        this.estado = 'error';
      }
    });
  }

  mouseEnter(idUsuario) {
    this.seguimientoUsuarioHover = idUsuario;
  }

  mouseLeave() {
    this.seguimientoUsuarioHover = 0;
  }

  seguirUsuario(seguido) {
    const seguimiento = {
      '_id': '',
      'usuario': this.identidad._id,
      'seguido': seguido,
    };

    this._seguimientoService.seguirUsuario(this.token, seguimiento).subscribe((res) => {
      if (!res.seguimiento) {
        this.estado = 'error';
      } else {
        this.estado = 'exito';
        this.seguimientos.push(seguido);
      }
    }, error => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError != null) {
        this.estado = 'error';
      }
    });
  }

  dejarDeSeguir(seguido) {
    this._seguimientoService.dejarDeSeguir(this.token, seguido).subscribe((res) => {
      const busqueda = this.seguimientos.indexOf(seguido);

      if (busqueda !== -1) {
        this.seguimientos.splice(busqueda, 1);
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError != null) {
        this.estado = 'error';
      }
    });
  }
}
