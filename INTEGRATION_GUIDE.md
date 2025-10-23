# 🔧 Instrucciones de Integración - Sistema de Retaceo

## ✅ Cambios Realizados en ProductComponent

### 🎯 Objetivo
Corregir el flujo para que los precios se asignen DESPUÉS del retaceo, no al crear el producto.

### 📝 Cambios Implementados

1. **Creación de Producto:**
   - ✅ Campo de precio removido del formulario
   - ✅ Mensaje informativo explicando el proceso
   - ✅ Validación de precio eliminada en creación

2. **Edición de Producto:**
   - ✅ Campo de precio visible pero en modo **solo lectura**
   - ✅ Indicador "Solo lectura" junto al label
   - ✅ Campo deshabilitado (no editable)
   - ✅ Mensaje: "El precio se asigna automáticamente después del proceso de retaceo"

3. **Visualización en Tarjetas:**
   - ✅ Muestra precio si existe
   - ✅ Muestra "Sin precio" si no está asignado
   - ✅ Badge amarillo con "Pendiente de retaceo" cuando no tiene precio

### 🖼️ Vista Previa del Formulario

**Al Crear Producto:**
```
┌─────────────────────────────────────┐
│ URL de la Imagen                     │
│ [https://...]                        │
├─────────────────────────────────────┤
│ Nombre del Producto                  │
│ [Prensadora SERT-655]                │
├─────────────────────────────────────┤
│ Descripción                          │
│ [Descripción del producto...]        │
├─────────────────────────────────────┤
│ Cantidad en Stock                    │
│ [10]                                 │
├─────────────────────────────────────┤
│ Subcategoría                         │
│ [Selecciona...]                      │
├─────────────────────────────────────┤
│ ℹ️ Sobre el Precio del Producto     │
│                                      │
│ El precio se asignará después de:   │
│ 1. Registro de gastos               │
│ 2. Cálculo del retaceo               │
│ 3. Análisis de precios               │
└─────────────────────────────────────┘
```

**Al Editar Producto:**
```
┌──────────────────┬──────────────────┐
│ Precio de Venta  │ Cantidad         │
│ (Solo lectura)   │                  │
│ [$71,332.00]     │ [10]             │
│ [DESHABILITADO]  │                  │
│ ℹ️ Se asigna     │                  │
│ automáticamente  │                  │
└──────────────────┴──────────────────┘
```

## 🚀 Cómo Usar BuyOrderDetailModal

### 1. Importar el Componente

```typescript
import { BuyOrderDetailModal } from "../components/BuyOrderDetailModal";
```

### 2. Agregar Estado

```typescript
const [selectedBuyOrder, setSelectedBuyOrder] = useState<any>(null);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
```

### 3. Función para Abrir el Modal

```typescript
const handleViewDetails = (buyOrder: any) => {
  setSelectedBuyOrder(buyOrder);
  setIsDetailModalOpen(true);
};
```

### 4. Renderizar el Modal

```typescript
<BuyOrderDetailModal
  buyOrder={selectedBuyOrder}
  isOpen={isDetailModalOpen}
  onClose={() => {
    setIsDetailModalOpen(false);
    setSelectedBuyOrder(null);
  }}
/>
```

### 5. Agregar Botón en la Tabla

```typescript
<button
  onClick={() => handleViewDetails(buyOrder)}
  className="btn btn-sm btn-primary"
>
  Ver Detalles
</button>
```

## 📊 Ejemplo Completo en BuyOrderComponent

```typescript
import { useState } from "react";
import { BuyOrderDetailModal } from "./BuyOrderDetailModal";
import { Eye } from "lucide-react";

export const BuyOrderComponent = () => {
  const { buyOrders } = useBuyOrderService();
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<any>(null);

  return (
    <div>
      {/* Tabla de Órdenes */}
      <table>
        <tbody>
          {buyOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.code}</td>
              <td>{order.supplier?.name}</td>
              <td>
                <button
                  onClick={() => setSelectedBuyOrder(order)}
                  className="btn btn-sm"
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Detalles */}
      <BuyOrderDetailModal
        buyOrder={selectedBuyOrder}
        isOpen={!!selectedBuyOrder}
        onClose={() => setSelectedBuyOrder(null)}
      />
    </div>
  );
};
```

## 🔄 Flujo de Trabajo Actualizado

```
┌─────────────────────────────────────┐
│ 1. CREAR PRODUCTO                   │
│    - Sin precio                      │
│    - Solo datos básicos              │
│    - Cantidad en stock               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. CREAR ORDEN DE COMPRA            │
│    - Seleccionar proveedor          │
│    - Agregar productos              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. REGISTRAR GASTOS EN BITÁCORA     │
│    - FOB (costo de productos)       │
│    - Flete                           │
│    - Seguro                          │
│    - DAI                             │
│    - Otros gastos                    │
│    ▶ Usar BuyOrderDetailModal       │
│      Tab: "Bitácora de Gastos"      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. CREAR PURCHASE                   │
│    - Vincular a orden de compra     │
│    - Agregar detalles de productos  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. CALCULAR RETACEO                 │
│    - Sistema calcula proporciones   │
│    - Distribuye gastos               │
│    ▶ Usar RetaceoCalculationView    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 6. CREAR RETACEO                    │
│    - Guardar cálculos                │
│    - Generar retaceo_details        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 7. APROBAR RETACEO                  │
│    ✓ Actualiza final_bill_retaceo   │
│    ✓ Crea price_history             │
│    ✓ Producto listo para pricing    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 8. ANÁLISIS DE PRECIOS              │
│    - Define % de utilidad           │
│    - Calcula precio de venta         │
│    - Actualiza products.price        │
│    ▶ PriceAnalysisComponent         │
└─────────────────────────────────────┘
```

## 🎨 Estilos y UX

### Indicadores Visuales

**Producto sin precio (card):**
```tsx
{(!product.price || product.price === 0) && (
  <div className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
    <p className="text-xs text-amber-700 flex items-center gap-1">
      ⚠️ Pendiente de retaceo
    </p>
  </div>
)}
```

**Precio en card:**
```tsx
{product.price && product.price > 0 ? (
  <span className="text-green-600">${product.price.toFixed(2)}</span>
) : (
  <span className="text-gray-400 text-sm">Sin precio</span>
)}
```

### Colores del Sistema

| Estado                | Color        | Uso                           |
|-----------------------|--------------|-------------------------------|
| Precio asignado       | Green-600    | Producto con precio           |
| Sin precio            | Amber-700    | Pendiente de retaceo          |
| Campo deshabilitado   | Gray-100     | Precio en edición (read-only) |
| Información           | Blue-600     | Mensajes informativos         |

## 📋 Checklist de Integración

- [ ] BuyOrderDetailModal agregado a BuyOrderComponent
- [ ] Botón "Ver Detalles" en tabla de órdenes
- [ ] Modal se abre correctamente
- [ ] Tab de "Bitácora de Gastos" funciona
- [ ] OrderLogComponent se carga dentro del modal
- [ ] Se pueden agregar/editar/eliminar gastos
- [ ] Totales se calculan correctamente
- [ ] ProductComponent actualizado (sin precio en creación)
- [ ] Indicador "Pendiente de retaceo" visible
- [ ] Mensaje informativo aparece al crear producto
- [ ] Precio en modo read-only al editar

## 🐛 Solución de Problemas

### El modal no se abre
✅ Verifica que `isOpen={!!selectedBuyOrder}` esté correctamente
✅ Asegúrate de que `selectedBuyOrder` tenga un valor válido

### OrderLog no carga en el modal
✅ Verifica que `buyOrder.id` exista
✅ Revisa la consola del navegador por errores de API

### Precio sigue siendo requerido al crear
✅ Verifica que `price` no tenga validación `required`
✅ Asegúrate de que el campo esté dentro del `{isEditing && (...)}`

### El precio no aparece en edición
✅ Verifica que el producto tenga `price` en la base de datos
✅ Asegúrate de que el backend devuelva el campo `price`

## 📞 Soporte

Si necesitas ayuda con la integración, revisa:
1. `IMPLEMENTATION_SUMMARY.md` - Resumen técnico
2. `QUICK_START_GUIDE.md` - Guía de uso
3. Comentarios en el código fuente

---

**Última actualización:** Octubre 20, 2025
