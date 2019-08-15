import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  public titulo: string;

  constructor() {
    this.titulo = 'Mensajes privados';
  }

  ngOnInit() {
    console.log('¡Componente mensajes principal cargado!');
  }
}
