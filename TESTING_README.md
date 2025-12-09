🧪 Plan de Pruebas Manuales (Black Box Testing)Este documento sirve como guía para validar la API de Gestión de Pedidos mediante Postman o cualquier cliente HTTP.Base URL: http://localhost:3000🟢 Escenario A: El Camino Feliz (Happy Path)Objetivo: Verificar el ciclo de vida normal de un pedido.1. Crear el PedidoMétodo: POSTEndpoint: /ordersBody (JSON):{
  "customer": "Ana",
  "item": "Teclado",
  "qty": 1
}
Resultado Esperado: Código 201 Created. Respuesta con id: 1 y status: "PENDING".2. Enviar el PedidoMétodo: PATCHEndpoint: /orders/1/statusBody (JSON):{
  "status": "SHIPPED"
}
Resultado Esperado: Código 200 OK. Respuesta con status: "SHIPPED".3. Entregar el PedidoMétodo: PATCHEndpoint: /orders/1/statusBody (JSON):{
  "status": "DELIVERED"
}
Resultado Esperado: Código 200 OK. Respuesta con status: "DELIVERED".🔴 Escenario B: Pruebas Negativas (Negative Testing)Objetivo: Intentar romper las reglas de negocio y verificar el manejo de errores.4. Prueba de Teletransportación (Salto de estado inválido)Intentar pasar de PENDING a DELIVERED sin pasar por SHIPPED.Paso Previo: Crear un nuevo pedido (ID 2).Método: PATCHEndpoint: /orders/2/statusBody (JSON):{
  "status": "DELIVERED"
}
Resultado Esperado: ❌ Error 400 Bad Request. Mensaje: "Must be SHIPPED first".5. Prueba de Arrepentimiento TardíoIntentar cancelar un pedido que ya salió del almacén.Paso Previo: Crear pedido (ID 3) y pasarlo a SHIPPED.Método: PATCHEndpoint: /orders/3/statusBody (JSON):{
  "status": "CANCELLED"
}
Resultado Esperado: ❌ Error 400 Bad Request. Mensaje indicando que no se puede cancelar si ya fue enviado.6. Prueba de Matemáticas (Validación de Datos)Intentar comprar una cantidad negativa.Método: POSTEndpoint: /ordersBody (JSON):{
  "customer": "X",
  "item": "Y",
  "qty": -10
}
Resultado Esperado: ❌ Error 400 Bad Request.7. Prueba de Caos (Datos Basura)Enviar valores fuera del vocabulario permitido.Método: PATCHEndpoint: /orders/1/statusBody (JSON):{
  "status": "ROBADO_POR_ALIENS"
}
Resultado Esperado: ❌ Error 400 Bad Request.
