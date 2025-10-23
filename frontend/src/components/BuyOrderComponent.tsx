import { useState, useEffect } from "react";
import { useBuyOrderService } from "../hooks/useBuyOrder.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { useQuoteService } from "../hooks/useQuote.service";
import { ModalComponent } from "./ModalComponent";
import { BuyOrderDetailModal } from "./BuyOrderDetailModal";
import { useForm } from "react-hook-form";
import { BuyOrder, CreateBuyOrderRequest, UpdateBuyOrderRequest } from "../interfaces/BuyOrder.interface";
import { Plus, Edit, Trash2, ShoppingCart, Search, Filter, Calendar, CheckCircle, Clock, XCircle, Truck, RefreshCw, Eye } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";
import { generateBuyOrderCode, getNextSequence } from "../utils/codeGenerator";

export const BuyOrderComponent = () => {
  const { buyOrders, create, update, deleteBuyOrder, loading, getBySupplierId, getByQuoteId } = useBuyOrderService();
  const { suppliers } = useSupplierService();
  const { quotes } = useQuoteService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBuyOrderId, setEditingBuyOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  
  // Estado para el modal de detalles con bitácora
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<BuyOrder | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateBuyOrderRequest>({
    defaultValues: {
      supplier_id: 0,
      quote_id: undefined,
      code: "",
      status: "pending",
      date_arrival: "",
    },
  });

  const handleEditBuyOrder = (item: BuyOrder) => {
    setIsEditing(true);
    setEditingBuyOrderId(item.id || null);
    setValue("supplier_id", item.supplier_id);
    setValue("quote_id", item.quote_id || undefined);
    setValue("code", item.code || "");
    setValue("status", item.status || "pending");
    setValue("date_arrival", item.date_arrival ? item.date_arrival.split('T')[0] : "");
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    
    // Generar código automáticamente
    const existingCodes = buyOrders.map(order => order.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "ORD");
    const newCode = generateBuyOrderCode(nextSeq);
    setValue("code", newCode);
    
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  // Auto-completar campos cuando se selecciona una cotización
  const handleQuoteChange = (quoteId: number) => {
    if (quoteId) {
      const selectedQuote = quotes.find(q => q.id === quoteId);
      if (selectedQuote) {
        // Auto-completar proveedor desde la cotización
        if (selectedQuote.supplier_id) {
          setValue("supplier_id", selectedQuote.supplier_id);
        }
        // Auto-completar fecha de llegada (30 días después de hoy por defecto)
        const arrivalDate = new Date();
        arrivalDate.setDate(arrivalDate.getDate() + 30);
        setValue("date_arrival", arrivalDate.toISOString().split('T')[0]);
      }
    }
  };

  // Regenerar código manualmente
  const handleRegenerateCode = () => {
    const existingCodes = buyOrders.map(order => order.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "ORD");
    const newCode = generateBuyOrderCode(nextSeq);
    setValue("code", newCode);
  };

  const handleSubmitBuyOrder = async (data: CreateBuyOrderRequest) => {
    try {
      if (isEditing && editingBuyOrderId) {
        await update(editingBuyOrderId, data);
        showAlert(
          "Orden Actualizada",
          "dark",
          "success",
          "¡Orden de compra actualizada exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Orden Creada",
          "dark",
          "success",
          "¡Orden de compra creada exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitBuyOrder:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteBuyOrder = async (id: number) => {
    try {
      await deleteBuyOrder(id);
      showAlert(
        "Orden Eliminada",
        "dark",
        "success",
        "¡Orden de compra eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar la orden."
      );
    }
  };

  const handleViewDetails = (order: BuyOrder) => {
    setSelectedBuyOrder(order);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBuyOrder(null);
  };

  const handleSupplierFilter = async (supplierId: number | null) => {
    setSelectedSupplierId(supplierId);
    if (supplierId) {
      await getBySupplierId(supplierId);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'received':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'received':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'received':
        return 'Recibida';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  };

  const filteredBuyOrders = buyOrders.filter(
    (order) =>
      (selectedSupplierId === null || order.supplier_id === selectedSupplierId) &&
      (selectedStatus === "" || order.status === selectedStatus) &&
      (order.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get supplier quotes for the form
  const getSupplierQuotes = (supplierId?: number) => {
    if (!supplierId) return [];
    return quotes.filter(quote => quote.supplier_id === supplierId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
                Órdenes de Compra
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona las órdenes de compra a proveedores
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nueva Orden
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <select
                value={selectedSupplierId || ""}
                onChange={(e) => handleSupplierFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="">Todos los proveedores</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="received">Recibida</option>
                <option value="cancelled">Cancelada</option>
              </select>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Buy Orders Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBuyOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBuyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.code || `ORD-${order.id}`}
                    </h3>
                  </div>

                  {/* Order Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Proveedor:</p>
                      <p className="font-medium text-gray-900">{order.supplier?.name}</p>
                    </div>
                    
                    {order.quote && (
                      <div>
                        <p className="text-sm text-gray-600">Cotización:</p>
                        <p className="font-medium text-gray-900">{order.quote.code || `COT-${order.quote.id}`}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.date || '').toLocaleDateString()}</span>
                    </div>

                    {order.date_arrival && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Truck className="h-4 w-4" />
                        <span>Llega: {new Date(order.date_arrival).toLocaleDateString()}</span>
                      </div>
                    )}

                    {order.buy_order_details && order.buy_order_details.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Items:</p>
                        <p className="font-medium text-gray-900">{order.buy_order_details.length} productos</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="w-full btn btn-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200"
                      title="Ver detalles y bitácora"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalles y Bitácora
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBuyOrder(order)}
                        className="flex-1 btn btn-outline btn-sm border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-colors duration-200"
                        title="Editar orden"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => order.id && handleDeleteBuyOrder(order.id)}
                        className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                        title="Eliminar orden"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || selectedSupplierId || selectedStatus ? "No se encontraron órdenes" : "No hay órdenes de compra"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSupplierId || selectedStatus
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Comienza creando tu primera orden de compra"
              }
            </p>
            {!searchTerm && !selectedSupplierId && !selectedStatus && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primera Orden
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
        content={
          <form onSubmit={handleSubmit(handleSubmitBuyOrder)} className="space-y-6">
            <div>
              <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor
              </label>
              <select
                {...register("supplier_id", { 
                  required: "Debe seleccionar un proveedor",
                  valueAsNumber: true
                })}
                id="supplier_id"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="">Selecciona un proveedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplier_id && (
                <p className="mt-1 text-sm text-red-600">{errors.supplier_id.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="quote_id" className="block text-sm font-medium text-gray-700 mb-2">
                Cotización (Opcional)
                <span className="text-xs text-gray-500 ml-2">Auto-completa proveedor y fecha</span>
              </label>
              <select
                {...register("quote_id", { valueAsNumber: true })}
                id="quote_id"
                onChange={(e) => handleQuoteChange(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="">Sin cotización base</option>
                {quotes.map((quote) => (
                  <option key={quote.id} value={quote.id}>
                    {quote.code || `COT-${quote.id}`} - {quote.supplier?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Orden
              </label>
              <div className="flex gap-2">
                <input
                  {...register("code")}
                  type="text"
                  id="code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="ORD-20251013-0001"
                />
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  className="px-4 py-3 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                  title="Regenerar código"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">El código se genera automáticamente</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                {...register("status")}
                id="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="received">Recibida</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <div>
              <label htmlFor="date_arrival" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Estimada de Llegada
              </label>
              <input
                {...register("date_arrival")}
                type="date"
                id="date_arrival"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-outline border-gray-300 hover:bg-gray-50 px-6 py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Orden" : "Crear Orden"
                )}
              </button>
            </div>
          </form>
        }
        onClose={handleCloseModal}
        open={open}
      />

      {/* Modal de Detalles con Bitácora */}
      {selectedBuyOrder && (
        <BuyOrderDetailModal
          buyOrder={selectedBuyOrder}
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};