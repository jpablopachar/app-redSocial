import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from 'src/app/services/global';
import { Publicacion } from './../../models/publicacion';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PublicacionService } from './../../services/publicacion.service';
import { SubirService } from 'src/app/services/subir.service';
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
  public archivoASubir: Array<File>;
  @Output() enviado = new EventEmitter();

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _publicacionService: PublicacionService, private _subirService: SubirService) {
    this.identidad = this._usuarioService.obtenerIdentidad();
    this.token = this._usuarioService.obtenerToken();
    this.estadisticas = this._usuarioService.obtenerEstadisticas();
    this.url = GLOBAL.url;
    this.publicacion = new Publicacion('', this.identidad._id, '', '', '');
  }

  ngOnInit() {
    // console.log('¡Componente sidebar cargado!');
  }

  enviarPublicacion(form: NgForm, evento) {
    this._publicacionService.agregarPublicacion(this.token, this.publicacion).subscribe((res) => {
      if (!res.publicacion) {
        this.estado = 'error';
      } else {
        if (this.archivoASubir && this.archivoASubir.length) {
          this._subirService.solicitarArchivo(this.url + 'subirImagenPublicacion/' + res.publicacion._id, [], this.archivoASubir, this.token, 'imagen').then((resultado: any) => {
            this.estado = 'success';
            console.log(resultado);
            this.publicacion.archivo = resultado.imagen;

            form.reset();
            this._router.navigate(['/timeline']);
            this.enviado.emit({enviar: 'true'});
          });
        } else {
          this.estado = 'success';

          form.reset();
          this._router.navigate(['/timeline']);
          this.enviado.emit({enviar: 'true'});
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

  eventoArchivo(entradaArchivo: any) {
    this.archivoASubir = <Array<File>>entradaArchivo.target.files;
  }
}
