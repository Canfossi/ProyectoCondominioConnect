import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',  // Plantilla HTML asociada al componente
  styleUrls: ['./custom-input.component.scss'],  // Estilos asociados al componente
})
export class CustomInputComponent implements OnInit {

  @Input() control!: FormControl;  // Control FormControl para manejar el estado del input
  @Input() type!: string;           // Tipo de input (text, number, password, etc.)
  @Input() label!: string;          // Etiqueta del input
  @Input() autoComplete!: string;   // Opciones de autocompletar del input
  @Input() icon!: string;           // Icono asociado al input

  isPassword!: boolean;             // Bandera para determinar si es un campo de contraseña
  hide: boolean = true;             // Bandera para ocultar o mostrar la contraseña

  constructor() { }

  ngOnInit() {
    if (this.type === 'password') {
      this.isPassword = true;
    }
  }

  showOrHidePassword() {
    this.hide = !this.hide;

    if (this.hide) {
      this.type = "password";
    } else {
      this.type = 'text';
    }
  }

}
