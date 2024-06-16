import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './components/add-update-product/add-update-product.component';

@NgModule({
  declarations: [
    HeaderComponent,             // Componente de encabezado
    CustomInputComponent,        // Componente de entrada personalizado
    LogoComponent,               // Componente de logotipo
    AddUpdateProductComponent    // Componente para agregar o actualizar productos
  ],
  exports: [
    HeaderComponent,             // Exporta el componente de encabezado
    CustomInputComponent,        // Exporta el componente de entrada personalizado
    LogoComponent,               // Exporta el componente de logotipo
    ReactiveFormsModule,         // Exporta el módulo de formularios reactivos
    AddUpdateProductComponent    // Exporta el componente para agregar o actualizar productos
  ],
  imports: [
    CommonModule,                // Módulo común de Angular para directivas y pipes
    IonicModule,                 // Módulo de Ionic para componentes y directivas específicas de Ionic
    ReactiveFormsModule,         // Módulo de formularios reactivos de Angular
    FormsModule                  // Módulo de formularios template-driven de Angular
  ]
})
export class SharedModule { }
