# 🔄 Flujo Completo del Sistema - Guía de Prueba

## ✅ Correcciones Realizadas

### Backend
1. **BuyOrder.controller.ts** - Copia automática de `quote_details` → `buy_order_details`
2. **Purchase.controller.ts** - Copia automática de `buy_order_details` → `purchase_details`
3. **Retaceo.controller.ts** - Cálculo automático de retaceo y actualización de stock/precio
4. **Product.repository.ts** - Agregado método `getById()`
5. **schema.prisma** - Agregados campos `bill_cost`, `final_bill_retaceo`, `utility` a `products`

### Frontend
1. **BuyOrderComponent** - Integrado modal con bitácora (BuyOrderDetailModal)
2. **PurchaseComponent** - Agregado botón "Retaceo" para ir directo al retaceo
3. **ProductComponent** - Precio y stock en solo lectura (se actualizan automáticamente)
4. **OrderLogComponent** - Gestión de bitácora de gastos (YA EXISTE)
5. **RetaceoCalculationView** - Visualización y cálculo de retaceo (YA EXISTE)

---

## 📋 Flujo Paso a Paso

### 1️⃣ **Crear Cotización (Quote)**
```
Componente: QuoteComponent
Pasos:
1. Click en "Nueva Cotización"
2. Seleccionar proveedor
3. Agregar productos con:
   - Cantidad solicitada
   - Precio cotizado
   - Unidad
4. Guardar cotización
5. **IMPORTANTE**: Aprobar productos (cambiar status a "approved")
```

**✅ Verificar**: 
- Quote creada con `quote_details`
- Algunos productos con `status: 'approved'`

---

### 2️⃣ **Crear Orden de Compra (BuyOrder)**
```
Componente: BuyOrderComponent
Pasos:
1. Click en "Nueva Orden"
2. Seleccionar cotización (auto-completa proveedor)
3. Definir fecha de llegada estimada
4. Guardar orden
```

**✅ Backend automático**:
```typescript
// BuyOrder.controller.ts
- Lee quote_details con status='approved'
- Crea buy_order_details automáticamente
- Usa quantity_approved (o quantity_req si no hay)
```

**✅ Verificar en consola**:
```
Creating buy order with data: {...}
Found X approved quote_details to copy
Created buy_order_detail: {...}
```

**✅ Verificar en UI**:
- Click en botón "Ver Detalles y Bitácora"
- Debe mostrar modal con:
  - Tab "Información General" con productos
  - Tab "Bitácora de Gastos" vacía

---

### 3️⃣ **Registrar Bitácora de Gastos (OrderLog)**
```
Componente: BuyOrderDetailModal > OrderLogComponent
Pasos:
1. En el modal de BuyOrder, ir a tab "Bitácora de Gastos"
2. Agregar todos los gastos:
   - FOB (costo de productos) - Obligatorio
   - Flete marítimo/aéreo
   - DAI (impuesto de importación)
   - Seguro
   - Honorarios aduanales
   - Otros gastos
3. Ver totales por tipo y total general
```

**✅ Verificar**:
- Suma de FOB ≈ Total de costos de productos en quote
- Total de gastos = FOB + Flete + DAI + Seguro + ...

---

### 4️⃣ **Crear Compra (Purchase)**
```
Componente: PurchaseComponent
Pasos:
1. Click en "Nueva Compra"
2. Seleccionar orden de compra (auto-completa proveedor)
3. Número de factura (auto-generado)
4. Guardar compra
```

**✅ Backend automático**:
```typescript
// Purchase.controller.ts
- Lee buy_order_details
- Crea purchase_details automáticamente
```

**✅ Verificar en consola**:
```
Creating purchase with data: {...}
Purchase created: {...}
Found X buy_order_details to copy
Created purchase_detail: {...}
```

---

### 5️⃣ **Calcular y Crear Retaceo**
```
Componente: PurchaseComponent > Botón "Retaceo"
Pasos:
1. Click en botón "Retaceo" en la fila de la compra
2. Se abre RetaceoComponent con purchase_id
3. Ver cálculo automático de retaceo:
   - Total FOB (suma de productos)
   - Gastos por tipo (de la bitácora)
   - Costos prorrateados por producto
   - Proporción de cada producto
4. Click en "Crear Retaceo con estos Cálculos"
```

**✅ Verificar cálculo**:
```
Para cada producto:
- proporción = (costo_producto / total_FOB) * 100
- gastos_prorrateados = suma de (cada_gasto * proporción)
- costo_final = costo_producto + gastos_prorrateados
- costo_unitario = costo_final / cantidad
```

**✅ Verificar en consola**:
```
=== CREATE WITH CALCULATION ===
Request body: {purchase_id: 1, ...}
Calculation response: {products: [...]}
Creating retaceo with data: {...}
Retaceo created: {...}
Creating details for X products
Created detail: {...}
Details created: X
Complete retaceo: {retaceo_details: [...]}
```

---

### 6️⃣ **Aprobar Retaceo** ⚠️ **PASO CRÍTICO**
```
Componente: RetaceoCalculationView
Pasos:
1. Click en "Aprobar Retaceo y Actualizar Precios"
2. Esperar confirmación
```

**✅ Backend automático**:
```typescript
// Retaceo.controller.ts -> approveRetaceo()
Para cada producto:
1. Obtener stock actual
2. Sumar cantidad comprada al stock
3. Calcular precio con 30% margen: precio = costo_unitario * 1.30
4. Actualizar producto:
   - amount = stock_actual + cantidad_comprada ✅
   - price = precio_con_margen ✅
   - final_bill_retaceo = costo_unitario ✅
   - bill_cost = costo_FOB ✅
5. Crear entrada en price_history
```

**✅ Verificar en consola**:
```
Approving retaceo ID: 1
Found X details
Product ID: 1, Unit cost: $XX, Quantity: YY
Current stock: ZZ, New stock: ZZ+YY
Suggested price: $XX
Updated product: {...}
```

**✅ Verificar en ProductComponent**:
```
Antes del retaceo:
- Precio: Sin precio (badge "Pendiente de retaceo")
- Stock: 0 unidades

Después del retaceo:
- Precio: $XX.XX (precio con margen)
- Stock: YY unidades
- Badge: Verde (precio asignado)
```

---

## 🎯 Ejemplo Completo con Números

### Datos Iniciales
```
Producto: Xiaomi 17 Pro Max
Cantidad en cotización: 14 unidades
Precio FOB: $1299 USD/unidad
```

### Bitácora de Gastos
```
FOB: $18,186 (14 × $1299)
Flete: $500
DAI (20%): $3,637.20
Seguro: $200
Total gastos: $4,337.20
Total general: $22,523.20
```

### Cálculo de Retaceo
```
Para Xiaomi 17 Pro Max:
- Proporción: 100% (único producto)
- Gastos prorrateados: $4,337.20
- Costo final: $18,186 + $4,337.20 = $22,523.20
- Costo unitario: $22,523.20 / 14 = $1,608.80
```

### Después de Aprobar Retaceo
```
Producto actualizado:
- Stock: 0 → 14 unidades ✅
- Precio: Sin precio → $2,091.44 USD ✅
  (Cálculo: $1,608.80 × 1.30 = $2,091.44)
- bill_cost: $1,299.00 ✅
- final_bill_retaceo: $1,608.80 ✅
- utility: 30% ✅
```

---

## 🐛 Problemas Comunes y Soluciones

### ❌ "Found 0 buy_order_details to copy"
**Causa**: Quote no tiene productos aprobados
**Solución**: En QuoteComponent, aprobar productos (status: 'approved')

### ❌ "Found 0 approved quote_details to copy"
**Causa**: Ningún producto en quote_details tiene status='approved'
**Solución**: Editar quote_details y cambiar status a 'approved'

### ❌ "Purchase has no details"
**Causa**: BuyOrder no tiene buy_order_details
**Solución**: Verificar paso 2 y reintentar

### ❌ "Total FOB cannot be zero"
**Causa**: No hay gastos en order_log
**Solución**: Registrar bitácora de gastos (paso 3)

### ❌ "retaceo_details: []"
**Causa**: Purchase no tiene purchase_details
**Solución**: Verificar paso 4 y recrear purchase

### ❌ Stock no se actualiza
**Causa**: Retaceo no fue aprobado
**Solución**: Click en "Aprobar Retaceo" en paso 6

### ❌ Precio no se asigna
**Causa**: Retaceo no fue aprobado o falló la actualización
**Solución**: Verificar consola del backend para errores

---

## 📊 Verificación Final

### En la Base de Datos
```sql
-- Verificar productos
SELECT id, name, amount, price, bill_cost, final_bill_retaceo, utility 
FROM products 
WHERE id = 1;

-- Verificar price_history
SELECT * FROM price_history 
WHERE product_id = 1 
ORDER BY date DESC;

-- Verificar retaceo_details
SELECT rd.*, p.name 
FROM retaceo_details rd
JOIN products p ON rd.product_id = p.id
WHERE retaceo_id = 1;
```

### En el Frontend
1. **ProductComponent**: Ver precio y stock actualizados
2. **PriceAnalysisComponent**: Ver costos y precios (aunque necesita simplificación)
3. **Historial de Precios**: Ver cambios de precio a lo largo del tiempo

---

## 🎓 Notas para Proyecto Académico

Este flujo representa un **sistema ERP mini real** con:
- ✅ Gestión de cotizaciones con aprobación selectiva
- ✅ Órdenes de compra con seguimiento
- ✅ Bitácora de gastos de importación
- ✅ Cálculo automático de costos (retaceo)
- ✅ Actualización automática de inventario (stock)
- ✅ Cálculo de precios con margen de utilidad
- ✅ Trazabilidad completa (quote → order → purchase → retaceo → product)

**Conceptos aplicados**:
- Programación orientada a eventos
- Patrones de diseño (Repository, Controller)
- Validación de datos
- Cálculos financieros
- Gestión de estado
- Auditoría de cambios

---

## ✨ Próximas Mejoras (Opcionales)

1. ❌ Eliminar status innecesarios (quote_details, buy_order_details, etc.)
2. 🔧 Simplificar PriceAnalysisComponent (solo visualización)
3. 📊 Dashboard con estadísticas de compras
4. 📧 Notificaciones de estados
5. 📄 Generación de reportes PDF
6. 🔐 Sistema de permisos por rol

---

**Fecha de actualización**: 21 de Octubre, 2025  
**Versión**: 1.0 - Flujo Completo Corregido
