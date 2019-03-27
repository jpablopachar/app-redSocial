import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Usuario } from './../../models/usuario';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  public titulo: string;
  public usuario: Usuario;
  public identidad;
  public token;
  public estado: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService) {
    this.titulo = 'Actualizar mis datos';
    this.usuario = this._usuarioService.obtenerIdentidad();
    this.identidad = this.usuario;
    this.token = this._usuarioService.obtenerToken();
  }

  ngOnInit() {
    console.log(this.usuario);
    console.log('¡Componente editar-usuario cargado!');
  }

  onSubmit() {
    console.log(this.usuario);
  }
}
