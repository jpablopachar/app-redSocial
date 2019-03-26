import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
  providers: [UsuarioService]
})
export class RegistrarComponent implements OnInit {
  titulo: string;
  usuario: Usuario;
  estado: string;

  constructor(private _route: ActivatedRoute, _router: Router, private _usuarioService: UsuarioService) {
    this.titulo = 'Regístrate';
    this.usuario = new Usuario('', '', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    console.log('¡Componente registrar cargado!');
  }

  onSubmit(form) {
    this._usuarioService.registrar(this.usuario).subscribe((res) => {
      if (res.usuario && res.usuario._id) {
        this.estado = 'exito';

        form.reset();
      } else {
        this.estado = 'error';
      }
    }, error => console.log(<any>error));
  }
}
