import { useState, useEffect } from "react";
import { useOrderLogService } from "../hooks/useOrderLog.service";
import { useForm } from "react-hook-form";
import type { OrderLog, CreateOrderLogRequest } from "../interfaces/Retaceo.interface";
import { Plus, Edit, Trash2, DollarSign, Calendar, FileText, AlertCircle } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

interface OrderLogComponentProps {
  buyOrderId: number;
}

export const OrderLogComponent = ({ buyOrderId }: OrderLogComponentProps) => {
  const { orderLogs, create, update, deleteOrderLog, getByBuyOrderId, loading } = useOrderLogService();
  const { showAlert } = useAlertsService();

  const [editingLog, setEditingLog] = useState<OrderLog | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateOrderLogRequest>({
    defaultValues: {
      buy_order_id: buyOrderId,
      date: new Date().toISOString().split('T')[0],
      item: "",
      value: 0,
      expense_type: "FOB",
    },
  });

  useEffect(() => {
    if (buyOrderId) {
      getByBuyOrderId(buyOrderId);
    }
  }, [buyOrderId, getByBuyOrderId]);

  const handleEdit = (log: OrderLog) => {
    setEditingLog(log);
    setValue("buy_order_id", log.buy_order_id);
    setValue("date", new Date(log.date).toISOString().split('T')[0]);
    setValue("item", log.item);
    setValue("value", log.value);
    setValue("expense_type", log.expense_type);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setEditingLog(null);
    reset({
      buy_order_id: buyOrderId,
      date: new Date().toISOString().split('T')[0],
      item: "",
      value: 0,
      expense_type: "FOB",
    });
    setIsFormVisible(false);
  };

  const handleSubmitLog = async (data: CreateOrderLogRequest) => {
    try {
      console.log('Submitting order log:', data);
      
      // Asegurar que los datos sean del tipo correcto
      const logData = {
        buy_order_id: Number(data.buy_order_id),
        date: data.date, // Enviar como string en formato YYYY-MM-DD
        item: String(data.item),
        value: Number(data.value),
        expense_type: String(data.expense_type)
      };
      
      console.log('Processed log data:', logData);
      
      if (editingLog && editingLog.id) {
        await update(editingLog.id, logData);
        showAlert("Gasto Actualizado", "dark", "success", "¡Gasto actualizado exitosamente!");
      } else {
        await create(logData);
        showAlert("Gasto Creado", "dark", "success", "¡Gasto agregado exitosamente!");
      }
      handleCancelEdit();
    } catch (error) {
      console.error('Error in handleSubmitLog:', error);
      showAlert("Error", "dark", "error", "Ha ocurrido un error. Por favor, intenta de nuevo.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      try {
        await deleteOrderLog(id, buyOrderId);
        showAlert("Gasto Eliminado", "dark", "success", "¡Gasto eliminado exitosamente!");
      } catch {
        showAlert("Error", "dark", "error", "Ha ocurrido un error al eliminar el gasto.");
      }
    }
  };

  // Calcular totales por tipo de gasto
  const totals = orderLogs.reduce((acc, log) => {
    const type = log.expense_type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += log.value;
    return acc;
  }, {} as { [key: string]: number });

  const grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={28} />
            Bitácora de Gastos
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Registro de todos los gastos asociados a esta orden de compra
          </p>
        </div>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus size={18} />
          {isFormVisible ? 'Ocultar Formulario' : 'Agregar Gasto'}
        </button>
      </div>

      {/* Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit(handleSubmitLog)} className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {editingLog ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                {...register("date", { required: "La fecha es requerida" })}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Gasto *
              </label>
              <select
                {...register("expense_type", { required: "El tipo es requerido" })}
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="FOB">FOB (Costo de Productos)</option>
                <option value="Flete">Flete</option>
                <option value="Seguro">Seguro</option>
                <option value="DAI">DAI (Impuesto de Importación)</option>
                <option value="IVA">IVA</option>
                <option value="Honorarios">Honorarios</option>
                <option value="Almacenaje">Almacenaje</option>
                <option value="Transporte">Transporte Local</option>
                <option value="Otros">Otros</option>
              </select>
              {errors.expense_type && (
                <p className="mt-1 text-sm text-red-600">{errors.expense_type.message}</p>
              )}
            </div>

            {/* Item Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <input
                type="text"
                {...register("item", { required: "La descripción es requerida" })}
                placeholder="Ej: Pago de flete marítimo"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.item && (
                <p className="mt-1 text-sm text-red-600">{errors.item.message}</p>
              )}
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto ($) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("value", { 
                  required: "El monto es requerido",
                  min: { value: 0.01, message: "El monto debe ser mayor a 0" }
                })}
                placeholder="0.00"
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Guardando..." : editingLog ? "Actualizar" : "Agregar"}
            </button>
          </div>
        </form>
      )}

      {/* Gastos Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando gastos...</span>
                  </div>
                </td>
              </tr>
            ) : orderLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <AlertCircle className="mx-auto text-gray-400 mb-2" size={40} />
                  <p className="text-gray-500">No hay gastos registrados</p>
                  <p className="text-sm text-gray-400 mt-1">Agrega el primer gasto usando el botón superior</p>
                </td>
              </tr>
            ) : (
              orderLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="text-gray-500" size={16} />
                      {new Date(log.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      log.expense_type === 'FOB' ? 'bg-purple-100 text-purple-800' :
                      log.expense_type === 'Flete' ? 'bg-blue-100 text-blue-800' :
                      log.expense_type === 'Seguro' ? 'bg-green-100 text-green-800' :
                      log.expense_type === 'DAI' ? 'bg-red-100 text-red-800' :
                      log.expense_type === 'IVA' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {log.expense_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {log.item}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    <div className="flex items-center justify-end gap-1 text-gray-900">
                      <DollarSign size={16} className="text-green-600" />
                      {log.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(log)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => log.id && handleDelete(log.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary / Totals */}
      {orderLogs.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Resumen de Gastos</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(totals).map(([type, amount]) => (
              <div key={type} className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">{type}</p>
                <p className="text-lg font-bold text-gray-900">
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">Total General:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
