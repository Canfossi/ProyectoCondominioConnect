import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddUpdateProductComponent } from './add-update-product.component';

describe('AddUpdateProductComponent', () => {
  let component: AddUpdateProductComponent;
  let fixture: ComponentFixture<AddUpdateProductComponent>;

  beforeEach(waitForAsync(() => {
    // Configuración del módulo de pruebas
    TestBed.configureTestingModule({
      declarations: [ AddUpdateProductComponent ], // Declaración del componente a probar
      imports: [IonicModule.forRoot()] // Importación del módulo IonicModule necesario para las pruebas
    }).compileComponents(); // Compilación de componentes asincrónicamente

    // Creación del componente y su fixture
    fixture = TestBed.createComponent(AddUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detección de cambios en el fixture
  }));

  it('should create', () => {
    // Verificación de que el componente se crea correctamente
    expect(component).toBeTruthy();
  });
});

