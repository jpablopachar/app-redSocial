import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/models/mensaje';
import { GLOBAL } from 'src/app/services/global';

@Component({
  selector: 'app-recibido',
  templateUrl: './recibido.component.html',
  styleUrls: ['./recibido.component.css'],
  providers: [UsuarioService, SeguimientoService, MensajesService]
})
export class RecibidoComponent implements OnInit {
  public titulo: string;
  public identidad;
  public token;
  public url: string;
  public mensajes: Mensaje[];
  public mensaje: Mensaje;
  public pagina;
  public paginas;
  public total;
  public paginaSiguiente;
  public paginaAnterior;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _seguimientoService: SeguimientoService, private _mensajesService: MensajesService) {
    this.titulo = 'Mensajes enviados';
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    this.url = GLOBAL.url;
    this.mensaje = new Mensaje('', this.identidad._id, '', '', '', '');
  }

  ngOnInit() {
    console.log('¡Componente mensajes recibidos cargado!');
    this.paginaActual();
  }

  obtenerMensajes(token, pagina) {
    this._mensajesService.obtenerMensajesRecibidos(token, this.pagina).subscribe(res => {
      if (res.mensajes) {
        this.mensajes = res.mensajes;
        console.log(this.mensajes);
        this.total = res.total;
        this.paginas = res.paginas;
      }
    }, error => console.log(<any>error));
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
        this.paginaSiguiente = pagina + 1;
        this.paginaAnterior = pagina - 1;

        if (this.paginaAnterior <= 0) {
          this.paginaAnterior = 1;
        }
      }

      this.obtenerMensajes(this.token, this.pagina);
    });
  }
}
