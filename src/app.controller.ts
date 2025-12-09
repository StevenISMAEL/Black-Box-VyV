import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('orders') // Esto hace que todas las rutas empiecen con /orders
export class AppController {
  constructor(private readonly appService: AppService) {}

  // POST /orders -> Crear pedido
  @Post()
  create(@Body() body: { customer: string; item: string; qty: number }) {
    return this.appService.createOrder(body.customer, body.item, body.qty);
  }

  // GET /orders -> Ver todos
  @Get()
  getAll() {
    return this.appService.getAllOrders();
  }

  // GET /orders/:id -> Ver uno específico
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.appService.getOrderById(+id);
  }

  // PATCH /orders/:id/status -> Cambiar estado (Aquí haremos las pruebas fuertes)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.appService.updateStatus(+id, body.status);
  }
}
