// Definimos una interfaz llamada Product.
export interface Product {
    name: string; // Nombre del producto.
    
    soldUnits: number; // Número de unidades vendidas.
    
    price: number; // Precio del producto.
    
    fecha: Date; // Fecha relacionada con el producto (por ejemplo, fecha de creación o de venta).
    
    hora: number; // Hora relacionada con el producto (por ejemplo, hora de venta).
    
    image: string; // URL de la imagen del producto.
    
    id: string; // Identificador único del producto.
    
    tipoServicio: string; // Tipo de servicio asociado al producto (si aplica).
    
    valorServicio: number; // Valor del servicio asociado al producto (si aplica).
    
    horaAgendada: number; // Hora agendada para el servicio asociado al producto (si aplica).
  }