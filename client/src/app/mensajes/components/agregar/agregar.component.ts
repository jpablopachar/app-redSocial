import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { MensajesService } from 'src/app/services/mensajes.service';
import { Mensaje } from 'src/app/models/mensaje';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css'],
  providers: [UsuarioService, SeguimientoService, MensajesService]
})
export class AgregarComponent implements OnInit {
  public titulo: string;
  public mensaje: Mensaje;
  public identidad;
  public token;
  public url: string;
  public estado: string;
  public seguidos;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _seguimientoService: SeguimientoService, private _mensajesService: MensajesService) {
      this.titulo = 'Enviar mensaje';
      this.identidad = this._usuarioService.obtenerIdentidad();
      this.token = this._usuarioService.obtenerToken();
      this.url = GLOBAL.url;
      this.mensaje = new Mensaje('', this.identidad._id, '', '', '', '');
    }

  ngOnInit() {
    console.log('¡Componente enviar mensaje cargado!');
    this.obtenerSeguidos();
  }

  enviarMensaje(form: NgForm) {
    this._mensajesService.agregarMensaje(this.token, this.mensaje).subscribe((res) => {
      if (res.mensaje) {
        this.estado = 'success';

        form.reset();
      }
    }, (error) => {
      this.estado = 'error';
      console.log(<any>error);
    });
  }

  obtenerSeguidos() {
    this._seguimientoService.obtenerMisSeguidos(this.token).subscribe(res => this.seguidos = res.seguidos, (error) => console.log(<any>error));
  }

}
