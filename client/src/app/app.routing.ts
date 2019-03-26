import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarComponent } from './components/registrar/registrar.component';

const appRoutes: Routes = [
  {path: '', component: IniciarSesionComponent},
  {path: 'iniciarSesion', component: IniciarSesionComponent},
  {path: 'registrarse', component: RegistrarComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
