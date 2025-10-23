# 🚀 Guía Rápida: Sistema de Retaceo y Bitácora

## 📦 Archivos Implementados

### Backend

```
backend/src/
├── controllers/
│   ├── Retaceo.controller.ts (✅ Actualizado)
│   └── OrderLog.controller.ts (✅ Existente)
├── repositories/
│   ├── Retaceo.repository.ts (✅ Existente)
│   ├── OrderLog.repository.ts (✅ Mejorado)
│   ├── Purchase.repository.ts (✅ Existente)
│   ├── Price.repository.ts (✅ Existente)
│   └── Product.repository.ts (✅ Existente)
├── routes/
│   ├── Retaceo.router.ts (✅ Actualizado)
│   └── OrderLog.router.ts (✅ Existente)
└── interfaces/
    ├── Retaceo.interface.ts (✅ Existente)
    ├── Product.interface.ts (✅ Actualizado)
    └── Price.interface.ts (✅ Actualizado)
```

### Frontend

```
frontend/src/
├── components/
│   ├── OrderLogComponent.tsx (✨ NUEVO)
│   ├── RetaceoCalculationView.tsx (✨ NUEVO)
│   └── BuyOrderDetailModal.tsx (✨ NUEVO)
├── hooks/
│   └── useOrderLog.service.ts (✨ NUEVO)
├── services/api/
│   ├── OrderLog.service.ts (✨ NUEVO)
│   └── Retaceo.service.ts (✅ Actualizado)
└── interfaces/
    └── Retaceo.interface.ts (✅ Actualizado)
```

## 🎯 Flujo de Trabajo Completo

### 1️⃣ Registrar Gastos en Bitácora

**Ubicación:** Detalle de Orden de Compra > Tab "Bitácora de Gastos"

**Tipos de gastos disponibles:**
- FOB (Costo de Productos)
- Flete
- Seguro
- DAI (Impuesto de Importación)
- IVA
- Honorarios
- Almacenaje
- Transporte Local
- Otros

**Ejemplo:**
```
Fecha: 2025-10-20
Tipo: Flete
Descripción: Flete marítimo desde China
Monto: $5,125.00
```

### 2️⃣ Crear Compra (Purchase)

**Requisitos:**
- Orden de compra existente con gastos registrados
- Productos con precios FOB definidos
- Proveedor seleccionado

**Flujo:**
1. Ir a "Compras"
2. Crear nueva compra
3. Seleccionar orden de compra
4. Agregar detalles de productos
5. Guardar compra

### 3️⃣ Calcular Retaceo

**Componente:** `RetaceoCalculationView`

**Proceso automático:**
```typescript
// El sistema calcula automáticamente:
// 1. Total FOB = Suma de (precio × cantidad) de todos los productos
// 2. Para cada producto:
//    - Proporción = (Costo FOB producto / Total FOB)
//    - Gastos prorrateados = Proporción × Total gastos
//    - Costo final = FOB + Gastos prorrateados
//    - Costo unitario = Costo final / Cantidad
```

**Ejemplo de cálculo:**
```
Producto: Prensadora SERT-655
Cantidad: 1
Costo FOB: $55,780.00
Proporción: 100%

Gastos prorrateados:
- Flete (9.19% del FOB): $5,125.00
- Seguro: $1,500.00
- DAI (16%): $8,927.00

Costo Final: $55,780 + $5,125 + $1,500 + $8,927 = $71,332.00
Costo Unitario: $71,332.00
```

### 4️⃣ Crear Retaceo

**Botón:** "Crear Retaceo con estos Cálculos"

**Acción:**
- Crea registro de retaceo
- Genera retaceo_details con costos calculados
- Estado inicial: "pending"

### 5️⃣ Aprobar Retaceo

**Botón:** "Aprobar Retaceo y Actualizar Precios"

**Acciones automáticas:**
1. Actualiza `products.final_bill_retaceo` con costo unitario
2. Crea registro en `price_history` con status "retaceo_approved"
3. Cambia estado del retaceo a "approved"

### 6️⃣ Análisis de Precios (Siguiente paso)

**Pendiente de implementar:**
1. Usar costos del retaceo aprobado
2. Definir % de utilidad deseado
3. Calcular precio de venta automáticamente
4. Actualizar `products.price` y tabla `price`

## 🛠️ Cómo Usar los Componentes

### OrderLogComponent

```tsx
import { OrderLogComponent } from "../components/OrderLogComponent";

// En el componente padre
<OrderLogComponent buyOrderId={123} />
```

**Funcionalidades:**
- ✅ Agregar gastos
- ✅ Editar gastos existentes
- ✅ Eliminar gastos
- ✅ Ver resumen de totales por tipo
- ✅ Formulario inline

### RetaceoCalculationView

```tsx
import { RetaceoCalculationView } from "../components/RetaceoCalculationView";

// En el componente padre
<RetaceoCalculationView 
  purchaseId={456}
  onRetaceoCreated={() => console.log("Retaceo creado!")}
/>
```

**Funcionalidades:**
- ✅ Cálculo automático de costos
- ✅ Visualización de proporciones
- ✅ Desglose de gastos
- ✅ Botones de acción
- ✅ Tarjetas de resumen

### BuyOrderDetailModal

```tsx
import { BuyOrderDetailModal } from "../components/BuyOrderDetailModal";

const [selectedOrder, setSelectedOrder] = useState(null);

<BuyOrderDetailModal
  buyOrder={selectedOrder}
  isOpen={!!selectedOrder}
  onClose={() => setSelectedOrder(null)}
/>
```

**Tabs:**
- **Información General:** Datos de la orden
- **Bitácora de Gastos:** OrderLogComponent integrado

## 🔧 Endpoints API Disponibles

### OrderLog
```
GET    /api/order-logs
GET    /api/order-logs/:id
GET    /api/order-logs/buy-order/:buyOrderId
POST   /api/order-logs
PUT    /api/order-logs/:id
DELETE /api/order-logs/:id
```

### Retaceo
```
GET    /api/retaceos
GET    /api/retaceos/:id
POST   /api/retaceos
PUT    /api/retaceos/:id
DELETE /api/retaceos/:id

POST   /api/retaceos/calculate (✨ NUEVO)
POST   /api/retaceos/create-with-calculation (✨ NUEVO)
POST   /api/retaceos/:id/approve (✨ NUEVO)
```

## 📊 Estructura de Datos

### OrderLog
```typescript
{
  id: number;
  buy_order_id: number;
  date: Date | string;
  item: string;           // Descripción del gasto
  value: number;          // Monto
  expense_type: string;   // FOB, Flete, DAI, etc.
}
```

### Cálculo de Retaceo (Response)
```typescript
{
  purchase_id: number;
  buy_order_id: number;
  total_fob: number;
  total_expenses: number;
  expenses_by_type: {
    FOB: number;
    Flete: number;
    Seguro: number;
    DAI: number;
    // ...
  };
  products: [
    {
      product_id: number;
      product: { name, code, ... };
      quantity: number;
      fob_cost: number;
      proportion: number;         // Porcentaje
      prorated_expenses: {        // Gastos prorrateados
        Flete: number;
        Seguro: number;
        // ...
      };
      total_prorated: number;
      final_cost: number;
      unit_cost: number;
    }
  ];
  summary: {
    total_cost: number;
    product_count: number;
  }
}
```

## ⚠️ Validaciones Importantes

1. **No se puede calcular retaceo si:**
   - La compra no tiene detalles
   - No hay gastos registrados en order_log
   - El total FOB es cero

2. **No se puede aprobar retaceo si:**
   - Ya está aprobado
   - No tiene detalles

3. **Los precios de productos:**
   - No se asignan en la creación
   - Se actualizan después del retaceo aprobado
   - El precio de venta se define en análisis de precios

## 🎨 Personalización UI

### Colores por tipo de gasto
```typescript
expense_type === 'FOB' → purple-100/purple-800
expense_type === 'Flete' → blue-100/blue-800
expense_type === 'Seguro' → green-100/green-800
expense_type === 'DAI' → red-100/red-800
expense_type === 'IVA' → yellow-100/yellow-800
Otros → gray-100/gray-800
```

### Estados de retaceo
```typescript
status === 'pending' → yellow-100/yellow-800
status === 'approved' → green-100/green-800
status === 'cancelled' → red-100/red-800
```

## 🚨 Solución de Problemas Comunes

### Error: "Purchase has no buy_order associated"
**Solución:** Asegúrate de que la compra tenga un buy_order_id válido

### Error: "Total FOB cannot be zero"
**Solución:** Verifica que los productos tengan precio y cantidad

### No aparecen gastos en la bitácora
**Solución:** Verifica el buy_order_id y que los gastos estén creados

### Cálculo de retaceo incorrecto
**Solución:** Revisa que todos los gastos tengan valores numéricos correctos

## 📝 Próximos Pasos Sugeridos

1. ✅ Implementar PriceAnalysisComponent mejorado
2. ✅ Actualizar ProductComponent
3. ✅ Crear ExpenseTypeComponent (opcional)
4. ✅ Agregar validaciones adicionales
5. ✅ Implementar reportes de costos
6. ✅ Agregar exportación a Excel/PDF

---

**Documentación completa disponible en:** `IMPLEMENTATION_SUMMARY.md`
