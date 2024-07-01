// Importación de módulos y servicios necesarios.
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model'; // Importación del modelo de usuario.
import { FirebaseService } from 'src/app/services/firebase.service'; // Servicio de Firebase.
import { UtilsService } from 'src/app/services/utils.service'; // Servicio de utilidades.

// Decorador que define los metadatos del componente.
@Component({
  selector: 'app-sign-up', // Selector del componente.
  templateUrl: './sign-up.page.html', // Ruta de la plantilla HTML.
  styleUrls: ['./sign-up.page.scss'], // Ruta de los estilos CSS.
})
export class SignUpPage implements OnInit {

  // Definición del formulario con validaciones.
  form = new FormGroup({
    uid: new FormControl(''), // Campo para el ID del usuario.
    email: new FormControl('', [Validators.required, Validators.email]), // Campo de correo con validaciones.
    password: new FormControl('', [Validators.required]), // Campo de contraseña con validaciones.
    name: new FormControl('', [Validators.required, Validators.minLength(4)]), // Campo de nombre con validaciones.
    perfil: new FormControl('Residente') // Campo de perfil con valor por defecto 'Residente'.
  });

  // Inyección de servicios necesarios.
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  // Método que se ejecuta al inicializar el componente.
  ngOnInit() {
    // Código a ejecutar al inicializar el componente.
  }

  // Método para manejar el envío del formulario.
  async submit() {
    if (this.form.valid) { // Verifica si el formulario es válido.
      const loading = await this.utilsSvc.loading(); // Muestra el indicador de carga.
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        // Actualización del nombre del usuario.
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid); // Establece el UID en el formulario.

        // Llamada al método para guardar la información del usuario.
        this.setUserInfo(uid);
      }).catch(error => {
        console.log(error); // Maneja el error.

        // Mostrar mensaje de error.
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss(); // Oculta el indicador de carga.
      });
    }
  }

  // Método para guardar la información del usuario en la base de datos.
  async setUserInfo(uid: string) {
    if (this.form.valid) { // Verifica si el formulario es válido.
      const loading = await this.utilsSvc.loading(); // Muestra el indicador de carga.
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password; // Eliminar la contraseña del objeto.

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        // Guardar información del usuario en local storage y redirigir.
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routeLink('/main/home'); // Redirige a la página principal.
        this.form.reset(); // Reinicia el formulario.
      }).catch(error => {
        console.log(error); // Maneja el error.

        // Mostrar mensaje de error.
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss(); // Oculta el indicador de carga.
      });
    }
  }
}
