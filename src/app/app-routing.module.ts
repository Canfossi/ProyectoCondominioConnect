import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

// Definición de las rutas de la aplicación
const routes: Routes = [
  {
    path: '', // Ruta inicial
    redirectTo: 'auth', // Redirecciona a 'auth' cuando la ruta es ''
    pathMatch: 'full' // La redirección ocurre solo cuando la ruta es exactamente ''
  },
  {
    path: 'auth', // Ruta para la autenticación
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule) // Carga el módulo AuthPageModule cuando se accede a esta ruta
  },
  {
    path: 'main', // Ruta principal después de autenticarse
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule), // Carga el módulo MainPageModule cuando se accede a esta ruta
    canActivate: [AuthGuard] // Guardia de ruta para verificar la autenticación del usuario (AuthGuard)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) // Configuración del enrutador principal con las rutas definidas y estrategia de precarga de módulos
  ],
  exports: [RouterModule] // Exporta el módulo de enrutamiento para ser utilizado en la aplicación
})
export class AppRoutingModule { }

