import { useState, useEffect } from "react";
import { useRetaceoService } from "../hooks/useRetaceo.service";
import { Calculator, CheckCircle, DollarSign, Package, TrendingUp } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

interface RetaceoCalculationViewProps {
  purchaseId: number;
  onRetaceoCreated?: () => void;
}

export const RetaceoCalculationView = ({ purchaseId, onRetaceoCreated }: RetaceoCalculationViewProps) => {
  const { calculateRetaceo, createWithCalculation, approveRetaceo, loading } = useRetaceoService();
  const { showAlert } = useAlertsService();
  
  const [calculation, setCalculation] = useState<any>(null);
  const [createdRetaceo, setCreatedRetaceo] = useState<any>(null);

  useEffect(() => {
    loadCalculation();
  }, [purchaseId]);

  const loadCalculation = async () => {
    try {
      const result = await calculateRetaceo(purchaseId);
      setCalculation(result);
    } catch (error) {
      console.error('Error calculating retaceo:', error);
      showAlert("Error", "dark", "error", "No se pudo calcular el retaceo");
    }
  };

  const handleCreateRetaceo = async () => {
    try {
      const result = await createWithCalculation({
        purchase_id: purchaseId,
        code: `RET-${new Date().getTime()}`,
        num_invoice: `INV-${new Date().getTime()}`,
        date: new Date().toISOString()
      });
      
      setCreatedRetaceo(result.retaceo);
      showAlert("Retaceo Creado", "dark", "success", "¡Retaceo creado exitosamente!");
      if (onRetaceoCreated) onRetaceoCreated();
    } catch (error) {
      console.error('Error creating retaceo:', error);
      showAlert("Error", "dark", "error", "No se pudo crear el retaceo");
    }
  };

  const handleApproveRetaceo = async () => {
    if (!createdRetaceo || !createdRetaceo.id) return;
    
    try {
      await approveRetaceo(createdRetaceo.id);
      showAlert("Retaceo Aprobado", "dark", "success", "¡Los costos han sido actualizados en los productos!");
      if (onRetaceoCreated) onRetaceoCreated();
    } catch (error) {
      console.error('Error approving retaceo:', error);
      showAlert("Error", "dark", "error", "No se pudo aprobar el retaceo");
    }
  };

  if (loading && !calculation) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Calculando retaceo...</span>
      </div>
    );
  }

  if (!calculation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo calcular el retaceo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total FOB</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                ${calculation.total_fob?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Package className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                ${calculation.total_expenses?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Costo Total</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${calculation.summary?.total_cost?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Desglose de Gastos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(calculation.expenses_by_type || {}).map(([type, amount]: [string, any]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-xs text-gray-600">{type}</p>
              <p className="text-lg font-bold text-gray-900">
                ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Costos Prorrateados por Producto</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Producto</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Cant.</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Costo FOB</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">% Proporción</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Gastos Prorrateados</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Costo Final</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Costo Unitario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {calculation.products?.map((product: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {product.product?.name || `Producto #${product.product_id}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                    ${product.fob_cost?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {product.proportion?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    ${product.total_prorated?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                    ${product.final_cost?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-purple-600">
                    ${product.unit_cost?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {!createdRetaceo ? (
          <button
            onClick={handleCreateRetaceo}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <Calculator size={20} />
            Crear Retaceo con estos Cálculos
          </button>
        ) : createdRetaceo.status !== 'approved' ? (
          <button
            onClick={handleApproveRetaceo}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium disabled:opacity-50"
          >
            <CheckCircle size={20} />
            Aprobar Retaceo y Actualizar Precios
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-3 flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span className="font-medium">Retaceo Aprobado - Costos Actualizados</span>
          </div>
        )}
      </div>
    </div>
  );
};
