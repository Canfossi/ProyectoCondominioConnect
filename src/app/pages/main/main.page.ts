import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  // Array de objetos que define las páginas del menú principal
  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' },
  ];

  // Inyección de dependencias de servicios y router
  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Variable para almacenar la ruta actual
  currentPath: string = '';

  constructor() { }

  ngOnInit() {
    // Subscripción a los eventos del router para obtener la ruta actual
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    });
  }

  // Función para obtener el usuario desde el almacenamiento local
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Función para cerrar sesión
  signOut() {
    this.firebaseSvc.signOut();
  }
}
