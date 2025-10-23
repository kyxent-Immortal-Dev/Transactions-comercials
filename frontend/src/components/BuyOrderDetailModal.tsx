import { useState } from "react";
import { OrderLogComponent } from "./OrderLogComponent";
import { FileText, Package, DollarSign } from "lucide-react";

interface BuyOrderDetailModalProps {
  buyOrder: any;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyOrderDetailModal = ({ buyOrder, isOpen, onClose }: BuyOrderDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "bitacora">("info");

  if (!isOpen || !buyOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Orden de Compra: {buyOrder.code || `#${buyOrder.id}`}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Proveedor: {buyOrder.supplier?.name || "N/A"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-500 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "info"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package size={18} />
              Información General
            </button>
            <button
              onClick={() => setActiveTab("bitacora")}
              className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === "bitacora"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText size={18} />
              Bitácora de Gastos
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Orden
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {buyOrder.code || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    buyOrder.status === 'received' ? 'bg-green-100 text-green-800' :
                    buyOrder.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    buyOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {buyOrder.status || 'N/A'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <p className="text-lg text-gray-900">
                    {buyOrder.supplier?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {buyOrder.supplier?.country || ""}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Llegada Estimada
                  </label>
                  <p className="text-lg text-gray-900">
                    {buyOrder.date_arrival 
                      ? new Date(buyOrder.date_arrival).toLocaleDateString('es-ES')
                      : "No definida"}
                  </p>
                </div>
              </div>

              {/* Quote Info if exists */}
              {buyOrder.quote && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Cotización Asociada</h3>
                  <p className="text-blue-700">
                    Código: {buyOrder.quote.code || `#${buyOrder.quote_id}`}
                  </p>
                  <p className="text-blue-600 text-sm">
                    Fecha: {new Date(buyOrder.quote.date).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}

              {/* Buy Order Details if available */}
              {buyOrder.buy_order_details && buyOrder.buy_order_details.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={22} />
                    Detalles de la Orden
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Producto</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cantidad</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Precio Unit.</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {buyOrder.buy_order_details.map((detail: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {detail.product?.name || `Producto #${detail.product_id}`}
                            </td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900">
                              {detail.quantity} {detail.unit}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">
                              ${detail.price?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              ${((detail.price || 0) * (detail.quantity || 0)).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                detail.status === 'received' ? 'bg-green-100 text-green-800' :
                                detail.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {detail.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bitacora" && buyOrder.id && (
            <OrderLogComponent buyOrderId={buyOrder.id} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
