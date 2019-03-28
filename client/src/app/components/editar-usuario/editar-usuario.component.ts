import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../../services/global';
import { Usuario } from './../../models/usuario';
import { UsuarioService } from './../../services/usuario.service';
import { SubirService } from 'src/app/services/subir.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  providers: [UsuarioService, SubirService]
})
export class EditarUsuarioComponent implements OnInit {
  public titulo: string;
  public usuario: Usuario;
  public identidad;
  public token;
  public estado: string;
  public archivosParaSubir: Array<File>;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService,
    private _subirService: SubirService) {
    this.titulo = 'Actualizar mis datos';
    this.usuario = this._usuarioService.obtenerIdentidad();
    this.identidad = this.usuario;
    this.token = this._usuarioService.obtenerToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log(this.usuario);
    console.log('¡Componente editar-usuario cargado!');
  }

  onSubmit() {
    console.log(this.usuario);
    this._usuarioService.actualizarUsuario(this.usuario).subscribe((res) => {
      if (!res.usuario) {
        this.estado = 'error';
      } else {
        this.estado = 'exito';

        localStorage.setItem('identidad', JSON.stringify(this.usuario));

        this.identidad = this.usuario;
        // Subida de imágen de usuario
        this._subirService.solicitarArchivo(this.url + 'subirImagenUsuario/' + this.usuario._id, [],
        this.archivosParaSubir, this.token, 'imagen').then((result: any) => {
          this.usuario.imagen = result.usuario.imagen;

          localStorage.setItem('identidad', JSON.stringify(this.usuario));
        });
      }
    }, (error) => {
      const mensajeError = <any>error;
      console.log(mensajeError);

      if (mensajeError !== null) {
        this.estado = 'error';
      }
    });
  }

  fileChangeEvent(archivoInput: any) {
    this.archivosParaSubir = <Array<File>>archivoInput.target.files;
    console.log(this.archivosParaSubir);
  }
}
