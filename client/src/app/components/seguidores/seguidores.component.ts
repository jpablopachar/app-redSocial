import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguimientoService } from './../../services/seguimiento.service';

@Component({
  selector: 'app-seguidores',
  templateUrl: './seguidores.component.html',
  styleUrls: ['./seguidores.component.css'],
  providers: [UsuarioService, SeguimientoService]
})
export class SeguidoresComponent implements OnInit {
  public titulo: string;
  public url: string;
  public identidad;
  public token;
  public pagina;
  public pagina_siguiente;
  public pagina_anterior;
  public total;
  public paginas;
  public usuario: Usuario;
  public usuarios: Usuario[];
  public seguimientos;
  public seguidores;
  public estado: string;
  public idPaginaUsuario;
  public seguimientoUsuarioHover;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _seguimientoService: SeguimientoService) {
    this.titulo = 'Seguidores de ';
    this.url = GLOBAL.url;
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    }

  ngOnInit() {
    console.log('¡Componente seguidores cargado!');
    this.paginaActual();
  }

  paginaActual() {
    this._route.params.subscribe((params) => {
      const idUsuario = params['idUsuario'];
      let pagina = +params['pagina'];

      this.idPaginaUsuario = idUsuario;
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
      this.obtenerUsuario(idUsuario, pagina);
    }, error => console.log(<any>error));
  }

  obtenerSeguidores(idUsuario, pagina) {
    this._seguimientoService.obtenerSeguidores(this.token, idUsuario, pagina).subscribe((res) => {
      if (!res.seguimientos) {
        this.estado = 'error';
      } else {
        this.total = res.total;
        this.paginas = res.paginas;
        this.seguidores = res.seguimientos;
        console.log(this.seguidores);
        this.seguimientos = res.usuariosSeguidores;

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

  obtenerUsuario(idUsuario, pagina) {
    this._usuarioService.obtenerUsuario(idUsuario).subscribe(res => {
      if (!res.usuario) {
        this._router.navigate(['/inicio']);
      } else {
        this.usuario = res.usuario;
        console.log(this.usuario);

        this.obtenerSeguidores(idUsuario, pagina);
      }
    }, error => {
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
        this.estado = 'success';
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
