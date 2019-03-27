import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css'],
  providers: [UsuarioService]
})
export class IniciarSesionComponent implements OnInit {
  public titulo: string;
  public usuario: Usuario;
  public estado: string;
  public identidad;
  public token;

  constructor(private _route: ActivatedRoute, private _router: Router, private _usuarioService: UsuarioService) {
    this.titulo = 'Iniciar Sesión';
    this.usuario = new Usuario('', '', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
     
  }

  onSubmit() {
    this._usuarioService.iniciarSesion(this.usuario).subscribe((res) => {
      this.identidad = res.usuario;

      console.log(this.identidad);

      if (!this.identidad || !this.identidad._id) {
        this.estado = 'error';
      } else {
        // Persistir datos del usuario
        localStorage.setItem('identidad', JSON.stringify(this.identidad));
        // Obtener el token
        this.obtenerToken();
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError != null) {
        this.estado = 'error';
      }
    });
  }

  obtenerToken() {
    this._usuarioService.iniciarSesion(this.usuario, 'true').subscribe((res) => {
      this.token = res.token;

      console.log(this.token);

      if (this.token.length <= 0) {
        this.estado = 'error';
      } else {
        // Persistir token del usuario
        localStorage.setItem('token', this.token);
        // Obtener los contadores o estadísticas del usuario
        this.obtenerContadores();
      }
    }, (error) => {
      const mensajeError = <any>error;

      console.log(mensajeError);

      if (mensajeError != null) {
        this.estado = 'error';
      }
    });
  }

  obtenerContadores() {
    this._usuarioService.obtenerContadores().subscribe((res) => {
      localStorage.setItem('estadisticas', JSON.stringify(res));

      this.estado = 'exito';

      this._router.navigate(['/']);
    }, error => console.log(<any>error));
  }
}
