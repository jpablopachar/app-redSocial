import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Publicacion } from './../../models/publicacion';
import { UsuarioService } from './../../services/usuario.service';
import { PublicacionService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css'],
  providers: [UsuarioService, PublicacionService]
})
export class PublicacionesComponent implements OnInit {
  public titulo: string;
  public identidad;
  public token;
  public url: string;
  public pagina;
  public total;
  public paginas;
  public estado;
  public publicaciones: Publicacion[];
  public elementosPorPagina;
  public noMas = false;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _publicacionService: PublicacionService) {
    this.titulo = 'Publicaciones';
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    this.url = GLOBAL.url;
    this.pagina = 1;
  }

  ngOnInit() {
    console.log('¡Componente publicaciones cargado!');
    this.obtenerPublicaciones(this.pagina);
  }

  obtenerPublicaciones(pagina, adicionar = false) {
    this._publicacionService.obtenerPublicaciones(this.token, pagina).subscribe((res) => {
      console.log(res);
      if (!res.publicaciones) {
        this.estado = 'error';
      } else {
        this.total = res.totalElementos;
        this.paginas = res.paginas;
        this.elementosPorPagina = res.elementosPorPagina;

        if (!adicionar) {
          this.publicaciones = res.publicaciones;
        } else {
          const arrayA = this.publicaciones;
          const arrayB = res.publicaciones;

          this.publicaciones = arrayA.concat(arrayB);
          // $('html, body').animate({ scrollTop: $('body').prop('scrollHeight') }, 500);
        }
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError !== null) {
        this.estado = 'error';
      }
    });
  }

  verMas() {
    this.pagina += 1;

    if (this.pagina === this.paginas) {
      this.noMas = true;
    }

    this.obtenerPublicaciones(this.pagina, true);
  }

}
