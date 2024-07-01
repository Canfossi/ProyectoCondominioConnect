// Importamos las decoraciones y funciones necesarias de Angular.
import { Injectable, inject } from '@angular/core';
// Importamos los tipos necesarios para implementar la guardia de ruta.
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
// Importamos la clase Observable de rxjs.
import { Observable } from 'rxjs';
// Importamos el servicio de Firebase que utilizaremos para la autenticación.
import { FirebaseService } from '../services/firebase.service';
// Importamos un servicio de utilidades que usaremos para redirigir rutas.
import { UtilsService } from '../services/utils.service';

// Decorador @Injectable que indica que este servicio se puede inyectar en otros lugares.
@Injectable({
  providedIn: 'root' // Indica que el servicio es singleton y se proporciona en la raíz del módulo.
})
export class NoAuthGuard implements CanActivate { // Implementamos la interfaz CanActivate.

  // Inyectamos los servicios de Firebase y Utils.
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Método que se ejecuta para determinar si la ruta puede ser activada.
  canActivate(
    route: ActivatedRouteSnapshot, // Información sobre la ruta actual.
    state: RouterStateSnapshot // Estado del router en el momento de la navegación.
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Obtenemos el usuario almacenado en localStorage.
    let user = localStorage.getItem('user');

    // Devolvemos una promesa que resuelve si la ruta puede ser activada.
    return new Promise((resolve) => {
      // Obtenemos el estado de autenticación del usuario.
      this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
        if (!auth) { // Si el usuario no está autenticado...
          resolve(true); // Permitimos el acceso.
        } else { // Si está autenticado...
          this.utilsSvc.routeLink('/main/home'); // Redirigimos a la ruta '/main/home'.
          resolve(false); // Denegamos el acceso.
        }
      });
    });
  }

}
