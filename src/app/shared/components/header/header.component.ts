import { Component, Input, OnInit, inject } from '@angular/core'; // Importación de componentes necesarios
import { UtilsService } from 'src/app/services/utils.service'; // Importación del servicio UtilsService

@Component({
  selector: 'app-header', // Selector del componente
  templateUrl: './header.component.html', // Plantilla HTML asociada al componente
  styleUrls: ['./header.component.scss'], // Estilos CSS asociados al componente
})
export class HeaderComponent implements OnInit {

  @Input() title!: string; // Propiedad de entrada para el título del encabezado
  @Input() backButton!: string; // Propiedad de entrada para la ruta de retroceso
  @Input() isModal!: boolean; // Propiedad de entrada para indicar si se trata de un modal
  @Input() showMenu!: boolean; // Propiedad de entrada para indicar si se debe mostrar el menú

  utilsSvc = inject(UtilsService); // Inyección del servicio UtilsService mediante el decorador inject

  ngOnInit() {
    // Método del ciclo de vida OnInit que se ejecuta cuando el componente se inicializa
  }

  dismissmodal() {
    this.utilsSvc.dismissModal(); // Método para cerrar el modal utilizando el servicio UtilsService
  }
}

