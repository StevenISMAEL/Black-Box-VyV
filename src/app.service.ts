import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

// Definimos la estructura de un Pedido
export interface Order {
  id: number;
  customer: string;
  item: string;
  qty: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

@Injectable()
export class AppService {
  private orders: Order[] = []; // Base de datos en memoria (se borra al reiniciar)
  private idCounter = 1;

  // --- REGLA 1: Creación ---
  createOrder(customer: string, item: string, qty: number): Order {
    // Validación: Datos obligatorios
    if (!customer || !item) {
      throw new BadRequestException('Customer and Item are required');
    }
    // Validación: Cantidad positiva (CASO DE BORDE)
    if (qty <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const newOrder: Order = {
      id: this.idCounter++,
      customer,
      item,
      qty,
      status: 'PENDING', // Todo pedido nace como PENDING
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  // --- Utilidades de Lectura ---
  getAllOrders() {
    return this.orders;
  }

  getOrderById(id: number) {
    const order = this.orders.find((o) => o.id === +id);
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  // --- REGLA 2: Máquina de Estados (Lo más importante para probar) ---
  updateStatus(id: number, newStatus: string) {
    const order = this.getOrderById(id);
    const validStatuses = ['SHIPPED', 'DELIVERED', 'CANCELLED'];

    // 1. Verificar si el estado existe
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestException(`Invalid status. Allowed: ${validStatuses}`);
    }

    // 2. Regla: Inmutabilidad final
    // Si ya se entregó o canceló, NO se toca más.
    if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
      throw new BadRequestException(`Order is already ${order.status} and cannot be changed`);
    }

    // 3. Regla: Flujo Lógico (PENDING -> SHIPPED)
    // No puedes entregar algo que no has enviado.
    if (order.status === 'PENDING' && newStatus === 'DELIVERED') {
      throw new BadRequestException('Cannot go from PENDING directly to DELIVERED. Must be SHIPPED first.');
    }

    // 4. Regla: Compromiso de envío
    // Si el camión ya salió (SHIPPED), no puedes cancelar.
    if (order.status === 'SHIPPED' && newStatus === 'CANCELLED') {
      throw new BadRequestException('Cannot CANCEL an order that has already been SHIPPED');
    }

    // Si pasa todas las validaciones, actualizamos
    order.status = newStatus as any;
    return order;
  }
}
