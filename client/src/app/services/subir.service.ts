import { Injectable } from '@angular/core';

import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SubirService {
  public url: string;

  constructor() {
    this.url = GLOBAL.url;
  }

  solicitarArchivo(url: string, params: Array<string>, archivos: Array<File>, token: string, nombre: string) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      for (let i = 0; i < archivos.length; i++) {
        formData.append(nombre, archivos[i], archivos[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);
    });
  }
}
