import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsuarioService } from './services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  constructor(private _usuarioService: UsuarioService, private _router: Router) {}
  canActivate() {
    const identidad = this._usuarioService.obtenerIdentidad();

    if (identidad && (identidad.cargo === 'ROLE_USER' || identidad.cargo === 'ROLE_ADMIN')) {
      return true;
    } else {
      this._router.navigate(['/iniciarSesion']);
      return false;
    }
  }
}
