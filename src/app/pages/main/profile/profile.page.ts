import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonds from 'pdfmake/build/vfs_fonts';
import { Console } from 'console';
pdfMake.vfs = pdfFonds.pdfMake.vfs;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  ObjectPDF : any;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  // Función para obtener el usuario desde el almacenamiento local
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //funcion de descarga de PDF
  descargaPdf(){
    var dd = {
      content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        
      ]
      
    }
    this.ObjectPDF =pdfMake.createPdf(dd);
   console.log('ya tengo creado el PDF');

    this.ObjectPDF.download('ReglamentoCondominio.pdf');
    console.log('ya tengo Descargado el PDF');
  }

  // Función para tomar/seleccionar una imagen de perfil
  async takeImage() {

    // Obtener el usuario actual
    let user = this.user();
    let path = `users/${user.uid}`;

    // Tomar la imagen del usuario
    const dataUrl = (await this.utilsSvc.takePicture('imagen del perfil')).dataUrl;
    const loading = await this.utilsSvc.loading();

    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    // Actualizar la imagen en Firebase y guardarla en el almacenamiento local
    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: "Imagen actualizada exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });

    }).catch(error => {
      console.log(error);

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
