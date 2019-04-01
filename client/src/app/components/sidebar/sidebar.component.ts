import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Publicacion } from './../../models/publicacion';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PublicacionService } from './../../services/publicacion.service';
import { NgForm } from '@angular/forms';

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
  @Output() enviado = new EventEmitter();

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _publicacionService: PublicacionService) {
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    this.estadisticas = this._usuarioService.obtenerEstadisticas();
    this.url = GLOBAL.url;
    this.publicacion = new Publicacion('', this.identidad._id, '', '', '');
  }

  ngOnInit() {
    console.log('¡Componente sidebar cargado!');
  }

  onSubmit(form: NgForm) {
    this._publicacionService.agregarPublicacion(this.token, this.publicacion).subscribe((res) => {
      if (!res.publicacion) {
        this.estado = 'error';
      } else {
        // this.publicacion = res.publicacion;
        this.estado = 'exito';
        form.reset();
        this._router.navigate(['/timeline']);
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError !== null) {
        this.estado = 'error';
      }
    });
  }

  enviarPublicacion(event) {
    console.log(event);
    this.enviado.emit({enviar: 'true'});
  }
}
