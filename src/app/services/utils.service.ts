import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importación del Capacitor Camera plugin

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  // Inyección de dependencias para los controladores de Ionic
  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);
  alertCtrl = inject(AlertController);

  // Servicio para capturar una imagen desde la cámara
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccione una imagen',
      promptLabelPicture: 'Tome una foto',
    });
  }

  // Mostrar una alerta
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
    await alert.present();
  }

  // Crear un loading spinner
  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  // Mostrar un toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  // Navegar a una página específica
  routeLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Guardar un elemento en localStorage
  saveInLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Obtener un elemento del localStorage
  getFromLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  // Mostrar un modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data;
  }

  // Cerrar un modal
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
