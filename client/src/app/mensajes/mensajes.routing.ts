import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalComponent } from './components/principal/principal.component';
import { AgregarComponent } from './components/agregar/agregar.component';
import { RecibidoComponent } from './components/recibido/recibido.component';
import { EnviadoComponent } from './components/enviado/enviado.component';

const mensajesRoutes: Routes = [
  {
    path: 'mensajes',
    component: PrincipalComponent,
    children: [
      {path: '', redirectTo: 'recibidos', pathMatch: 'full'},
      {path: 'enviar', component: AgregarComponent},
      {path: 'recibidos', component: RecibidoComponent},
      {path: 'enviados', component: EnviadoComponent},
    ]
  },
];

/* @NgModule({
  imports: [RouterModule.forChild(mensajesRoutes)],
  exports: [RouterModule]
})
export class MensajesRoutingModule { } */

export const mensajesRoutingProviders: any[] = [];
export const mensajesRouting: ModuleWithProviders = RouterModule.forRoot(mensajesRoutes);
