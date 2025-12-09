# 🧪 Plan de Pruebas Manuales (Black Box Testing)

Este documento sirve como guía para validar la **API de Gestión de Pedidos** mediante **Postman** o cualquier cliente HTTP.

---

## 🌐 Base URL

http://localhost:3000

---

## 🟢 Escenario A: El Camino Feliz (Happy Path)

**Objetivo:** Verificar el ciclo de vida normal de un pedido.

---

### 1. Crear el Pedido

- **Método:** POST
- **Endpoint:** `http://localhost:3000/orders`

**Body (JSON):**

{
  "customer": "Ana",
  "item": "Teclado",
  "qty": 1
}

**Resultado esperado:**
- Código: 201 Created
- Respuesta con `id: 1`
- Status: `PENDING`

---

### 2. Enviar el Pedido

- **Método:** PATCH
- **Endpoint:** `http://localhost:3000/orders/1/status`

**Body (JSON):**

{
  "status": "SHIPPED"
}

**Resultado esperado:**
- Código: 200 OK
- Status: `SHIPPED`

---

### 3. Entregar el Pedido

- **Método:** PATCH
- **Endpoint:** `http://localhost:3000/orders/1/status`

**Body (JSON):**

{
  "status": "DELIVERED"
}

**Resultado esperado:**
- Código: 200 OK
- Status: `DELIVERED`

---

## 🔴 Escenario B: Pruebas Negativas (Negative Testing)

**Objetivo:** Intentar romper las reglas de negocio y validar el manejo de errores.

---

### 4. Prueba de Teletransportación (Salto de estado inválido)

Intentar pasar de `PENDING` a `DELIVERED` sin pasar por `SHIPPED`.

**Paso previo:** Crear pedido con ID 2.

- **Método:** PATCH
- **Endpoint:** `http://localhost:3000/orders/2/status`

**Body (JSON):**

{
  "status": "DELIVERED"
}

**Resultado esperado:**
- Código: 400 Bad Request
- Mensaje: "Must be SHIPPED first"

---

### 5. Prueba de Arrepentimiento Tardío

Intentar cancelar un pedido que ya fue enviado.

**Paso previo:** Crear pedido con ID 3 y cambiarlo a `SHIPPED`.

- **Método:** PATCH
- **Endpoint:** `http://localhost:3000/orders/3/status`

**Body (JSON):**

{
  "status": "CANCELLED"
}

**Resultado esperado:**
- Código: 400 Bad Request
- Mensaje: No se puede cancelar si ya fue enviado

---

### 6. Prueba de Matemáticas (Validación de Datos)

Intentar crear un pedido con cantidad negativa.

- **Método:** POST
- **Endpoint:** `http://localhost:3000/orders`

**Body (JSON):**

{
  "customer": "X",
  "item": "Y",
  "qty": -10
}

**Resultado esperado:**
- Código: 400 Bad Request

---

### 7. Prueba de Caos (Datos Basura)

Enviar un estado no válido.

- **Método:** PATCH
- **Endpoint:** `http://localhost:3000/orders/1/status`

**Body (JSON):**

{
  "status": "ROBADO_POR_ALIENS"
}

**Resultado esperado:**
- Código: 400 Bad Request
