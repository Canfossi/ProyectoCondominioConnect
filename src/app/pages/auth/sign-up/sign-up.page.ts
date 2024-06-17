import { Component, OnInit,inject } from '@angular/core';
import { FormControl,  FormGroup,  Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  // Definición del formulario con validaciones
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    perfil: new FormControl('Residente')
  });

  // Inyección de servicios necesarios
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    // Código a ejecutar al inicializar el componente
  }

  // Método para manejar el envío del formulario
  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        // Actualización del nombre del usuario
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);

        // Llamada al método para guardar la información del usuario
        this.setUserInfo(uid);
      }).catch(error => {
        console.log(error);

        // Mostrar mensaje de error
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  // Método para guardar la información del usuario en la base de datos
  async setUserInfo(uid: string) {
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;  // Eliminar la contraseña del objeto

      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        // Guardar información del usuario en local storage y redirigir
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routeLink('/main/home');
        this.form.reset();
      }).catch(error => {
        console.log(error);

        // Mostrar mensaje de error
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }
}