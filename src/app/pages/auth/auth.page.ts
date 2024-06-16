import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  // FormGroup para manejar el formulario de login
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  // Inyección de servicios FirebaseService y UtilsService
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    // Método del ciclo de vida OnInit, se ejecuta al iniciar el componente
  }

  //======================================================================
  // Método asincrónico para manejar el envío del formulario de login
  async submit() {
    if (this.form.valid) { // Verifica si el formulario es válido

      const loading = await this.utilsSvc.loading(); // Muestra un loader mientras se procesa la petición
      await loading.present(); // Muestra el loader

      // Llama al método de autenticación signIn del servicio FirebaseService
      this.firebaseSvc.signIn(this.form.value as User).then(res => {
        // En caso de éxito, llama a la función para obtener información del usuario
        this.getUserInfo(res.user.uid);
      }).catch(error => {
        console.log(error); // Registra errores en la consola

        // Muestra un toast con el mensaje de error
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss(); // Descarta el loader después de completar la operación
      });
    }
  }
  //======================================================================

  // Método asincrónico para obtener información del usuario
  async getUserInfo(uid: string) {
    if (this.form.valid) { // Verifica si el formulario es válido

      const loading = await this.utilsSvc.loading(); // Muestra un loader mientras se procesa la petición
      await loading.present(); // Muestra el loader

      let path = `users/${uid}`; // Construye la ruta para obtener información del usuario en Firebase
      delete this.form.value.password; // Elimina temporalmente el campo de contraseña del formulario

      // Llama al método para obtener el documento de usuario desde Firebase
      this.firebaseSvc.getDocument(path).then((user: User) => {
        console.log(user); // Muestra el usuario en la consola

        // Guarda la información del usuario en el almacenamiento local
        this.utilsSvc.saveInLocalStorage('user', user);

        // Redirige al usuario a la página principal después de iniciar sesión
        this.utilsSvc.routeLink('/main/home');

        // Reinicia el formulario después de completar el proceso de inicio de sesión
        this.form.reset();

        // Muestra un toast de bienvenida al usuario
        this.utilsSvc.presentToast({
          message: `Te damos la bienvenida ${user.name}`,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        });

      }).catch(error => {
        console.log(error); // Registra errores en la consola

        // Muestra un toast con el mensaje de error
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });

      }).finally(() => {
        loading.dismiss(); // Descarta el loader después de completar la operación
      });
    }
  }

}
