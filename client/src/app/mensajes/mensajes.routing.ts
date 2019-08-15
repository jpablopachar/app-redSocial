import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalComponent } from './components/principal/principal.component';
import { AgregarComponent } from './components/agregar/agregar.component';
import { RecibidoComponent } from './components/recibido/recibido.component';
import { EnviadoComponent } from './components/enviado/enviado.component';
import { UsuarioGuard } from '../usuario.guard';

const mensajesRoutes: Routes = [
  {
    path: 'mensajes',
    component: PrincipalComponent,
    children: [
      {path: '', redirectTo: 'recibidos', pathMatch: 'full'},
      {path: 'enviar', component: AgregarComponent, canActivate: [UsuarioGuard]},
      {path: 'recibidos', component: RecibidoComponent, canActivate: [UsuarioGuard]},
      {path: 'recibidos/:pagina', component: RecibidoComponent, canActivate: [UsuarioGuard]},
      {path: 'enviados', component: EnviadoComponent, canActivate: [UsuarioGuard]},
      {path: 'enviados/:pagina', component: EnviadoComponent, canActivate: [UsuarioGuard]},
    ]
  },
];

export const mensajesRoutingProviders: any[] = [];
export const mensajesRouting: ModuleWithProviders = RouterModule.forRoot(mensajesRoutes);
