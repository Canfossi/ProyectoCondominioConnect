import { Component, OnInit, inject } from '@angular/core';
import { flatMap } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore'; // Importación para ordenar

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = []; // Arreglo para almacenar productos
  loading: boolean = false; // Variable para controlar el estado de carga

  ngOnInit() {
  }

  // Retorna los datos del usuario desde el almacenamiento local
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  // Se ejecuta cada vez que el usuario entra en la página
  ionViewWillEnter() {
    this.getProducts();
  }

  // Método para refrescar la lista de productos
  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  // Calcula y retorna las ganancias totales sumando el precio de todos los productos
  getProfits() {
    return this.products.reduce((total, product) => total + product.price, 0);
  }

  // Obtiene la lista de productos ordenados por unidades vendidas de manera descendente
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    this.loading = true;

    let query = [orderBy('hora', 'desc')]; // Query para ordenar por unidades vendidas

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res; // Asigna la respuesta al arreglo de productos
        this.loading = false; // Finaliza la carga

        sub.unsubscribe(); // Desuscribe la subscripción
      }
    });
  }

  // Abre un modal para agregar o actualizar un producto
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });

    if (success) {
      this.getProducts(); // Actualiza la lista de productos si se realizó con éxito la operación
    }
  }

  // Presenta un mensaje de confirmación para eliminar un producto
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Quieres eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteProduct(product); // Llama al método para eliminar el producto
          }
        }
      ]
    });
  }

  // Elimina un producto específico
  async deleteProduct(product: Product) {
    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getfilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath); // Elimina la imagen asociada al producto

    this.firebaseSvc.deleteDocument(path).then(async res => {
      // Filtra y actualiza la lista de productos eliminando el producto eliminado
      this.products = this.products.filter(p => p.id !== product.id);

      // Muestra un mensaje de éxito al usuario
      this.utilsSvc.presentToast({
        message: "Producto eliminado exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);

      // Muestra un mensaje de error al usuario si ocurre un problema
      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss(); // Cierra el loading al finalizar la operación
    });
  }

}
