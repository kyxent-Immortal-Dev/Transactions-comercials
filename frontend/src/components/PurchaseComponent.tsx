import { useState } from "react";
import { usePurchase } from "../hooks/usePurchase.service";
import { useBuyOrderService } from "../hooks/useBuyOrder.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { Purchase, CreatePurchaseRequest } from "../interfaces/Purchase.interface";
import { Plus, Edit, Trash2, Package, Search, Calendar, Truck, RefreshCw } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";
import { generatePurchaseCode, generateInvoiceNumber, getNextSequence } from "../utils/codeGenerator";

export const PurchaseComponent = () => {
  const { purchases, createPurchase, updatePurchase, deletePurchase, loading } = usePurchase();
  const { buyOrders } = useBuyOrderService();
  const { suppliers } = useSupplierService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPurchaseId, setEditingPurchaseId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [selectedBuyOrderId, setSelectedBuyOrderId] = useState<number | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreatePurchaseRequest>({
    defaultValues: {
      buy_order_id: 0,
      supplier_id: 0,
      date: "",
      code: "",
      num_invoice: "",
      status: "pending",
    },
  });

  const handleEditPurchase = (item: Purchase) => {
    setIsEditing(true);
    setEditingPurchaseId(item.id || null);
    setValue("buy_order_id", item.buy_order_id);
    setValue("supplier_id", item.supplier_id);
    setValue("date", item.date ? new Date(item.date).toISOString().split('T')[0] : "");
    setValue("code", item.code || "");
    setValue("num_invoice", item.num_invoice || "");
    setValue("status", item.status || "pending");
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    
    // Generar código automáticamente
    const existingCodes = purchases.map(p => p.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "PUR");
    const newCode = generatePurchaseCode(nextSeq);
    setValue("code", newCode);
    
    // Generar número de factura automáticamente
    const existingInvoices = purchases.map(p => p.num_invoice || "").filter(inv => inv);
    const nextInvSeq = getNextSequence(existingInvoices, "INV");
    const newInvoice = generateInvoiceNumber(nextInvSeq);
    setValue("num_invoice", newInvoice);
    
    // Fecha por defecto (hoy)
    setValue("date", new Date().toISOString().split('T')[0]);
    
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleBuyOrderChange = (buyOrderId: number) => {
    setSelectedBuyOrderId(buyOrderId === 0 ? null : buyOrderId);
    
    // Auto-fill supplier based on buy order selection
    if (buyOrderId) {
      const selectedBuyOrder = buyOrders.find(bo => bo.id === buyOrderId);
      if (selectedBuyOrder) {
        setValue("supplier_id", selectedBuyOrder.supplier_id);
      }
    }
  };

  // Regenerar código manualmente
  const handleRegenerateCode = () => {
    const existingCodes = purchases.map(p => p.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "PUR");
    const newCode = generatePurchaseCode(nextSeq);
    setValue("code", newCode);
  };

  // Regenerar número de factura manualmente
  const handleRegenerateInvoice = () => {
    const existingInvoices = purchases.map(p => p.num_invoice || "").filter(inv => inv);
    const nextInvSeq = getNextSequence(existingInvoices, "INV");
    const newInvoice = generateInvoiceNumber(nextInvSeq);
    setValue("num_invoice", newInvoice);
  };

  const handleSubmitPurchase = async (data: CreatePurchaseRequest) => {
    try {
      // Asegurar que los IDs sean números
      const purchaseData = {
        ...data,
        buy_order_id: Number(data.buy_order_id),
        supplier_id: Number(data.supplier_id)
      };

      if (isEditing && editingPurchaseId) {
        await updatePurchase(editingPurchaseId, purchaseData);
        showAlert(
          "Compra Actualizada",
          "dark",
          "success",
          "¡Compra actualizada exitosamente!"
        );
      } else {
        await createPurchase(purchaseData);
        showAlert(
          "Compra Creada",
          "dark",
          "success",
          "¡Compra creada exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitPurchase:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeletePurchase = async (id: number) => {
    try {
      await deletePurchase(id);
      showAlert(
        "Compra Eliminada",
        "dark",
        "success",
        "¡Compra eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Error al eliminar la compra"
      );
    }
  };

  const handleSupplierChange = (supplierId: number) => {
    setSelectedSupplierId(supplierId === 0 ? null : supplierId);
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.buy_order?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = selectedSupplierId === null || purchase.supplier_id === selectedSupplierId;
    const matchesBuyOrder = selectedBuyOrderId === null || purchase.buy_order_id === selectedBuyOrderId;
    
    return matchesSearch && matchesSupplier && matchesBuyOrder;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="text-blue-600" size={40} />
              Gestión de Compras
            </h1>
            <p className="text-gray-600 mt-2">
              Administra las compras asociadas a órdenes de compra
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por código o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Supplier Filter */}
          <div className="relative">
            <select
              value={selectedSupplierId || ""}
              onChange={(e) => handleSupplierChange(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Todos los Proveedores</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buy Order Filter */}
          <div className="relative">
            <select
              value={selectedBuyOrderId || ""}
              onChange={(e) => setSelectedBuyOrderId(Number(e.target.value) || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Todas las Órdenes</option>
              {buyOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orden de Compra
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3 text-gray-600">Cargando compras...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron compras
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                  <tr
                    key={purchase.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #{purchase.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {purchase.code || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="text-blue-600" size={16} />
                        <span className="font-medium text-gray-900">
                          {purchase.buy_order?.code || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {purchase.supplier?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="text-gray-500" size={16} />
                        {purchase.date ? new Date(purchase.date).toLocaleDateString('es-ES') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        purchase.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : purchase.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {purchase.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPurchase(purchase)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => purchase.id && handleDeletePurchase(purchase.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ModalComponent 
        open={open} 
        onClose={handleCloseModal}
        title={isEditing ? "Editar Compra" : "Nueva Compra"}
        content={
          <form onSubmit={handleSubmit(handleSubmitPurchase)} className="space-y-6">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("code")}
                  placeholder="PUR-20251013-0001"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    title="Regenerar código"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">El código se genera automáticamente</p>
            </div>

            {/* Buy Order Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden de Compra *
                <span className="text-xs text-gray-500 ml-2">Auto-completa proveedor</span>
              </label>
              <select
                {...register("buy_order_id", {
                  required: "La orden de compra es requerida",
                  valueAsNumber: true,
                })}
                onChange={(e) => handleBuyOrderChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione una orden</option>
                {buyOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.code} - {order.supplier?.name}
                  </option>
                ))}
              </select>
              {errors.buy_order_id && (
                <p className="mt-1 text-sm text-red-600">{errors.buy_order_id.message}</p>
              )}
            </div>

            {/* Supplier Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proveedor *
              </label>
              <select
                {...register("supplier_id", {
                  required: "El proveedor es requerido",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione un proveedor</option>
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

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Factura
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("num_invoice")}
                  placeholder="INV-20251013-0001"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleRegenerateInvoice}
                    className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    title="Regenerar número de factura"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">El número se genera automáticamente</p>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                {...register("date", {
                  required: "La fecha es requerida",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                {...register("status")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        }
      />
    </div>
  );
};
