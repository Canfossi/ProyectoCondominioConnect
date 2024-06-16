import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';  // Importación del modelo Product
import { User } from 'src/app/models/user.model';  // Importación del modelo User
import { FirebaseService } from 'src/app/services/firebase.service';  // Servicio Firebase para operaciones CRUD
import { UtilsService } from 'src/app/services/utils.service';  // Servicio de utilidades (modales, toasts, etc.)

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;  // Propiedad de entrada para recibir el producto a editar
  
  form = new FormGroup({
    id: new FormControl(''),  // Control para el ID del producto (no visible en el formulario)
    image: new FormControl('', [Validators.required]),  // Control para la imagen del producto
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),  // Control para el nombre del producto
    price: new FormControl(null, [Validators.required, Validators.min(0)]),  // Control para el precio del producto
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)])  // Control para las unidades vendidas del producto
  });

  firebaseSvc = inject(FirebaseService);  // Inyección del servicio Firebase
  utilsSvc = inject(UtilsService);  // Inyección del servicio de utilidades

  user = {} as User;  // Objeto para almacenar la información del usuario

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');  // Obtener el usuario del localStorage al iniciar el componente
    if (this.product) this.form.setValue(this.product);  // Si hay un producto existente, establecer los valores en el formulario
  }

  // Método para tomar o seleccionar una imagen para el producto
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('imagen del producto')).dataUrl;  // Utiliza el servicio para capturar una imagen
    this.form.controls.image.setValue(dataUrl);  // Establece la URL de la imagen en el control 'image' del formulario
  }

  // Método para validar y enviar el formulario
  submit() {
    if (this.form.valid) {
      // Si hay un producto, se está actualizando; de lo contrario, se está agregando uno nuevo
      if (this.product) {
        this.updateProduct();  // Llama al método para actualizar el producto
      } else {
        this.createProduct();  // Llama al método para crear un nuevo producto
      }
    }
  }

  // Método para convertir los valores de entrada de texto a números
  setNumberInputs() {
    let { soldUnits, price } = this.form.controls;
    if (soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));  // Convierte soldUnits a número si tiene un valor
    if (price.value) price.setValue(parseFloat(price.value));  // Convierte price a número si tiene un valor
  }

  // Método para agregar un nuevo producto
  async createProduct() {
    let path = `users/${this.user.uid}/products`;  // Ruta en Firestore para almacenar productos del usuario actual

    const loading = await this.utilsSvc.loading();  // Muestra un spinner de carga mientras se procesa la acción
    await loading.present();  // Presenta el componente de carga

    // Sube la imagen a Firebase Storage y obtiene la URL de la imagen
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);  // Establece la URL de la imagen en el formulario

    // Elimina el campo 'id' del formulario antes de agregar el producto a Firestore
    delete this.form.value.id;

    // Agrega el documento (producto) a Firestore
    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });  // Cierra el modal y envía un objeto indicando éxito
      this.utilsSvc.presentToast({  // Muestra un toast indicando éxito
        message: "producto agregado exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);  // Maneja errores imprimiéndolos en la consola
      this.utilsSvc.presentToast({  // Muestra un toast indicando el mensaje de error
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();  // Cierra el componente de carga al finalizar la operación
    });
  }

  // Método para actualizar un producto existente
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product.id}`;  // Ruta en Firestore para actualizar el producto

    const loading = await this.utilsSvc.loading();  // Muestra un spinner de carga mientras se procesa la acción
    await loading.present();  // Presenta el componente de carga

    // Verifica si la imagen ha cambiado y la actualiza en Firebase Storage si es necesario
    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getfilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);  // Establece la URL de la nueva imagen en el formulario
    }

    // Elimina el campo 'id' del formulario antes de actualizar el producto en Firestore
    delete this.form.value.id;

    // Actualiza el documento (producto) en Firestore
    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });  // Cierra el modal y envía un objeto indicando éxito
      this.utilsSvc.presentToast({  // Muestra un toast indicando éxito
        message: "producto actualizado exitosamente",
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    }).catch(error => {
      console.log(error);  // Maneja errores imprimiéndolos en la consola
      this.utilsSvc.presentToast({  // Muestra un toast indicando el mensaje de error
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();  // Cierra el componente de carga al finalizar la operación
    });
  }

}
