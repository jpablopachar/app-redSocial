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

const appRoutes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'inicio', component: InicioComponent},
  {path: 'iniciarSesion', component: IniciarSesionComponent},
  {path: 'registrarse', component: RegistrarComponent},
  {path: 'actualizarUsuario', component: EditarUsuarioComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'usuarios/:pagina', component: UsuariosComponent},
  {path: 'timeline', component: TimelineComponent},
  {path: 'perfil/:idUsuario', component: PerfilComponent},
  {path: 'seguidos/:idUsuario/:pagina', component: SeguidosComponent},
  {path: 'seguidores/:idUsuario/:pagina', component: SeguidoresComponent},
  {path: '**', component: InicioComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
