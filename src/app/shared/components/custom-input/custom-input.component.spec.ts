import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomInputComponent } from './custom-input.component';

describe('CustomInputComponent', () => {
  let component: CustomInputComponent;
  let fixture: ComponentFixture<CustomInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomInputComponent ],   // Declaraciones de componentes que se están probando
      imports: [IonicModule.forRoot()]         // Importación de módulos necesarios para las pruebas
    }).compileComponents();                      // Compilación de componentes asincrónicamente

    fixture = TestBed.createComponent(CustomInputComponent);  // Creación del componente
    component = fixture.componentInstance;      // Asignación del componente de prueba
    fixture.detectChanges();                   // Detección de cambios en el componente
  }));

  it('should create', () => {
    expect(component).toBeTruthy();            // Prueba: verifica si el componente se crea correctamente
  });
});
