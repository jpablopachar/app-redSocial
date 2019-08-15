import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SeguidosComponent } from './components/seguidos/seguidos.component';
import { SeguidoresComponent } from './components/seguidores/seguidores.component';
import { UsuarioGuard } from './usuario.guard';

const appRoutes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'iniciarSesion', component: IniciarSesionComponent},
  {path: 'registrarse', component: RegistrarComponent},
  {path: 'actualizarUsuario', component: EditarUsuarioComponent, canActivate: [UsuarioGuard]},
  {path: 'usuarios', component: UsuariosComponent, canActivate: [UsuarioGuard]},
  {path: 'usuarios/:pagina', component: UsuariosComponent, canActivate: [UsuarioGuard]},
  {path: 'timeline', component: TimelineComponent, canActivate: [UsuarioGuard]},
  {path: 'perfil/:idUsuario', component: PerfilComponent, canActivate: [UsuarioGuard]},
  {path: 'seguidos/:idUsuario/:pagina', component: SeguidosComponent, canActivate: [UsuarioGuard]},
  {path: 'seguidores/:idUsuario/:pagina', component: SeguidoresComponent, canActivate: [UsuarioGuard]},
  {path: '**', component: InicioComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
