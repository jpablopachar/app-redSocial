import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarComponent } from './components/registrar/registrar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicacionesComponent } from './components/publicaciones/publicaciones.component';

@NgModule({
  declarations: [
    AppComponent,
    IniciarSesionComponent,
    RegistrarComponent,
    InicioComponent,
    EditarUsuarioComponent,
    UsuariosComponent,
    SidebarComponent,
    TimelineComponent,
    PublicacionesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    MomentModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
