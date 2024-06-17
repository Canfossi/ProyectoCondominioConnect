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
    //name: new FormControl('', [Validators.required, Validators.minLength(4)]),  // Control para el nombre del producto
    fecha: new FormControl(null, [Validators.required]),// Control para el tipo de servicio
    tipoServicio: new FormControl('', [Validators.required]),  // Control para la fecha del producto
    //soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),  // Control para las unidades vendidas del producto
    price: new FormControl(null), //new FormControl(null, [Validators.required, Validators.min(0)]), // Control para el precio del producto
   // price: new FormControl({value: null, disabled: true}, [Validators.required, Validators.min(0)]), // Control para el precio del producto
    hora: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(23)]),  // Control para la hora del producto (número entre 0 y 23)
    
  
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

  //metodo para que cuando elijan un tipo de servicio me mande un valor ya fijada

  setPrecioImputs()
  {
    console.log("entre aqui");
  
    
      if (this.form.get('tipoServicio').value === 'Estacionamiento') { 
       
        // Establecer el valor fijo para estacionamiento (1.000 pesos chilenos)
        this.form.get('price')?.setValue('1000');
        //this.form.get('price').disable = true;
      } 
      //----------------------------------------------------------------
      else  if (this.form.get('tipoServicio').value === 'Quincho') {
        // Establecer el valor fijo para estacionamiento (1.000 pesos chilenos)
        this.form.get('price')?.setValue('5000');
      }
      //---------------------------------------------------------------
      else  if (this.form.get('tipoServicio').value === 'Piscina') {
        // Establecer el valor fijo para estacionamiento (1.000 pesos chilenos)
        this.form.get('price')?.setValue('2000');
      }
      //---------------------------------------------------------------
      else  if (this.form.get('tipoServicio').value === 'Sala De Evento') {
        // Establecer el valor fijo para estacionamiento (1.000 pesos chilenos)
        this.form.get('price')?.setValue('30000');
      }
      //---------------------------------------------------------------
      else {
         //Limpiar el valor de garantia para otros tipos de servicio
       this.form.get('price')?.setValue('');
      }
    ;
    console.log("entre aqui 23");
  
    //this.form.get('price').disable({onlySelf: true});
  }
//----------------------------------------------------------------
 
  // Método para convertir los valores de entrada de texto a números
  setNumberInputs() {
  
    let { hora, price } = this.form.controls;
    if (hora.value) hora.setValue(parseFloat(hora.value));  // Convierte soldUnits a número si tiene un valor
    if (price.value) price.setValue(parseFloat(price.value));

     // Convierte price a número si tiene un valor
    
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

  createDateListeners() {
    // Observe Date changes
    const self = this;
    var previous = '';
    const targetNode = document.querySelector('ion-datetime#orderDatePicker');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                var e = document.querySelector('ion-datetime#orderDatePicker').shadowRoot.querySelector('ion-label').textContent;
                if(e !== previous)
                {
                    previous = e;
                    console.log('[Date Listener]: e', e);
                    let date_interpret = new Date(e);
                    // self.current_month = date_interpret.getMonth()+1;
                    // console.log('[Date Listener]: Current month', self.current_month);
                    // self.current_month_blockout_dates = self.checkMonth(self.current_month);
                    
                    return;
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

}
