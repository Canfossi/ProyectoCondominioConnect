// Importación de módulos y servicios necesarios
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model'; // Importación del modelo de usuario
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio de Firebase
import { UtilsService } from 'src/app/services/utils.service'; // Servicio de utilidades

// Decorador que define los metadatos del componente
@Component({
  selector: 'app-forgot-password', // Selector del componente
  templateUrl: './forgot-password.page.html', // Ruta de la plantilla HTML
  styleUrls: ['./forgot-password.page.scss'], // Ruta de los estilos CSS
})
export class ForgotPasswordPage implements OnInit {

  // Definición del formulario con validaciones
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Campo de correo con validaciones
  });

  // Inyección de los servicios de Firebase y utilidades
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {}

  //======================================================================
  // Método para enviar el formulario
  async submit() {
    // Verifica si el formulario es válido
    if (this.form.valid) {
      // Muestra el indicador de carga
      const loading = await this.utilsSvc.loading();
      await loading.present();

      // Llama al servicio de Firebase para enviar el correo de recuperación
      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {
        // Muestra un mensaje de éxito
        this.utilsSvc.presentToast({
          message: 'Correo enviado con éxito',
          duration: 1500,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        });

        // Redirige a la página de autenticación y reinicia el formulario
        this.utilsSvc.routeLink('/auth');
        this.form.reset();
      }).catch(error => {
        // Maneja el error y muestra un mensaje
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        // Oculta el indicador de carga
        loading.dismiss();
      });
    }
  }
  //======================================================================
}






