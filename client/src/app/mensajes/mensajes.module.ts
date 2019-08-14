import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';

import { PrincipalComponent } from '../mensajes/components/principal/principal.component';
import { AgregarComponent } from '../mensajes/components/agregar/agregar.component';
import { RecibidoComponent } from '../mensajes/components/recibido/recibido.component';
import { EnviadoComponent } from '../mensajes/components/enviado/enviado.component';
import { mensajesRouting, mensajesRoutingProviders } from './mensajes.routing';

@NgModule({
  declarations: [
    PrincipalComponent,
    AgregarComponent,
    RecibidoComponent,
    EnviadoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    mensajesRouting
  ],
  exports: [
    PrincipalComponent,
    AgregarComponent,
    RecibidoComponent,
    EnviadoComponent
  ],
  providers: [
    mensajesRoutingProviders
  ]
})
export class MensajesModule { }
