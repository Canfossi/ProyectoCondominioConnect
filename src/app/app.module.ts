import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importación del módulo AngularFire para Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent], // Declaración de componentes que pertenecen a este módulo
  imports: [
    BrowserModule, // Módulo para la ejecución en un navegador
    IonicModule.forRoot(), // Módulo principal de Ionic
    AppRoutingModule, // Módulo de rutas principal de la aplicación
    AngularFireModule.initializeApp(environment.firebaseConfig) // Inicialización del módulo AngularFire con la configuración de Firebase
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } // Configuración del proveedor para la estrategia de reutilización de rutas en Ionic
  ],
  bootstrap: [AppComponent], // Componente principal que inicia la aplicación
})
export class AppModule {} // Definición del módulo AppModule

