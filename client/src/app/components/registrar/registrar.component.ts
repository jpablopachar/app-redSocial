import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  titulo: string;

  constructor() {
    this.titulo = 'Regístrate';
  }

  ngOnInit() {
    console.log('¡Componente registrar cargado!');
  }

}
