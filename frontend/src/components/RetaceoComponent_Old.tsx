import { useState } from "react";
import { useRetaceoService } from "../hooks/useRetaceo.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { useBuyOrderService } from "../hooks/useBuyOrder.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { Retaceo, CreateRetaceoRequest } from "../interfaces/Retaceo.interface";
import { Plus, Edit, Trash2, FileText, Search, Filter, Calendar, Package, DollarSign, TrendingUp } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const RetaceoComponent = () => {
  const { retaceos, create, update, deleteRetaceo, loading } = useRetaceoService();
  const { suppliers } = useSupplierService();
  const { buyOrders } = useBuyOrderService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRetaceoId, setEditingRetaceoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateRetaceoRequest>({
    defaultValues: {
      code: "",
      supplier_id: 0,
      buy_order_id: undefined,
      invoice_number: "",
      invoice_date: "",
      policy_number: "",
      policy_date: "",
      fob_total: 0,
      freight: 0,
      insurance: 0,
      dai: 0,
      other_expenses: 0,
      iva_percentage: 15,
    },
  });

  // Watch values for automatic calculations
  const fobTotal = watch("fob_total") || 0;
  const freight = watch("freight") || 0;
  const insurance = watch("insurance") || 0;
  const ivaPercentage = watch("iva_percentage") || 0;

  // Calculate CIF and IVA
  const calculateCIF = () => {
    return fobTotal + freight + insurance;
  };

  const calculateIVA = () => {
    const cif = calculateCIF();
    return (cif * ivaPercentage) / 100;
  };

  const handleEditRetaceo = (item: Retaceo) => {
    setIsEditing(true);
    setEditingRetaceoId(item.id || null);
    setValue("code", item.code);
    setValue("supplier_id", item.supplier_id);
    setValue("buy_order_id", item.buy_order_id || undefined);
    setValue("invoice_number", item.invoice_number || "");
    setValue("invoice_date", item.invoice_date ? new Date(item.invoice_date).toISOString().split('T')[0] : "");
    setValue("policy_number", item.policy_number || "");
    setValue("policy_date", item.policy_date ? new Date(item.policy_date).toISOString().split('T')[0] : "");
    setValue("fob_total", item.fob_total);
    setValue("freight", item.freight);
    setValue("insurance", item.insurance);
    setValue("dai", item.dai);
    setValue("other_expenses", item.other_expenses);
    setValue("iva_percentage", item.iva_percentage || 15);
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleSubmitRetaceo = async (data: CreateRetaceoRequest) => {
    try {
      // Add calculated values
      const submitData = {
        ...data,
        cif_total: calculateCIF(),
        iva_amount: calculateIVA(),
      };

      if (isEditing && editingRetaceoId) {
        await update(editingRetaceoId, submitData);
        showAlert(
          "Retaceo Actualizado",
          "dark",
          "success",
          "¡Retaceo actualizado exitosamente!"
        );
      } else {
        await create(submitData);
        showAlert(
          "Retaceo Creado",
          "dark",
          "success",
          "¡Retaceo creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitRetaceo:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteRetaceo = async (id: number) => {
    try {
      await deleteRetaceo(id);
      showAlert(
        "Retaceo Eliminado",
        "dark",
        "success",
        "¡Retaceo eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar el retaceo."
      );
    }
  };

  const handleSupplierFilter = async (supplierId: number | null) => {
    setSelectedSupplierId(supplierId);
  };

  const filteredRetaceos = retaceos.filter(
    (retaceo) =>
      (selectedSupplierId === null || retaceo.supplier_id === selectedSupplierId) &&
      (retaceo.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retaceo.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retaceo.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (value?: number | null) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: 'NIO'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                Retaceos
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona el prorrateo de costos de importación
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nuevo Retaceo
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar retaceos..."
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
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Retaceos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRetaceos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRetaceos.map((retaceo) => (
              <div
                key={retaceo.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Retaceo Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Activo
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {retaceo.code}
                    </h3>
                  </div>

                  {/* Retaceo Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Proveedor:</p>
                      <p className="font-medium text-gray-900">{retaceo.supplier?.name}</p>
                    </div>
                    
                    {retaceo.buy_order && (
                      <div>
                        <p className="text-sm text-gray-600">Orden de Compra:</p>
                        <p className="font-medium text-gray-900">{retaceo.buy_order.code || `ORD-${retaceo.buy_order.id}`}</p>
                      </div>
                    )}

                    {retaceo.invoice_number && (
                      <div>
                        <p className="text-sm text-gray-600">Factura:</p>
                        <p className="font-medium text-gray-900">{retaceo.invoice_number}</p>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          FOB Total:
                        </span>
                        <span className="font-semibold text-gray-900">{formatCurrency(retaceo.fob_total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          CIF Total:
                        </span>
                        <span className="font-semibold text-indigo-600">{formatCurrency(retaceo.cif_total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 text-sm pt-2">
                      <Calendar className="h-4 w-4" />
                      <span>{retaceo.date ? new Date(retaceo.date).toLocaleDateString() : 'N/A'}</span>
                    </div>

                    {retaceo.retaceo_details && retaceo.retaceo_details.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Package className="h-4 w-4" />
                        <span>{retaceo.retaceo_details.length} productos</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditRetaceo(retaceo)}
                      className="flex-1 btn btn-outline btn-sm border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-colors duration-200"
                      title="Editar retaceo"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => retaceo.id && handleDeleteRetaceo(retaceo.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar retaceo"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || selectedSupplierId ? "No se encontraron retaceos" : "No hay retaceos"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSupplierId
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Comienza creando tu primer retaceo"
              }
            </p>
            {!searchTerm && !selectedSupplierId && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primer Retaceo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Retaceo" : "Nuevo Retaceo"}
        content={
          <form onSubmit={handleSubmit(handleSubmitRetaceo)} className="space-y-6 max-h-[70vh] overflow-y-auto px-2">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Código <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("code", { required: "El código es requerido" })}
                    type="text"
                    id="code"
                    placeholder="RTC-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.code && (
                    <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="supplier_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor <span className="text-red-500">*</span>
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
              </div>

              <div>
                <label htmlFor="buy_order_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de Compra (Opcional)
                </label>
                <select
                  {...register("buy_order_id", { valueAsNumber: true })}
                  id="buy_order_id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="">Sin orden de compra</option>
                  {buyOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.code || `ORD-${order.id}`} - {order.supplier?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invoice Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información de Factura</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Factura
                  </label>
                  <input
                    {...register("invoice_number")}
                    type="text"
                    id="invoice_number"
                    placeholder="INV-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Factura
                  </label>
                  <input
                    {...register("invoice_date")}
                    type="date"
                    id="invoice_date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="policy_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Póliza
                  </label>
                  <input
                    {...register("policy_number")}
                    type="text"
                    id="policy_number"
                    placeholder="POL-001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="policy_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Póliza
                  </label>
                  <input
                    {...register("policy_date")}
                    type="date"
                    id="policy_date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Cost Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Costos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fob_total" className="block text-sm font-medium text-gray-700 mb-2">
                    Total FOB <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fob_total", { 
                      required: "El total FOB es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor a 0" }
                    })}
                    type="number"
                    step="0.01"
                    id="fob_total"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.fob_total && (
                    <p className="mt-1 text-sm text-red-600">{errors.fob_total.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="freight" className="block text-sm font-medium text-gray-700 mb-2">
                    Flete <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("freight", { 
                      required: "El flete es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor o igual a 0" }
                    })}
                    type="number"
                    step="0.01"
                    id="freight"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.freight && (
                    <p className="mt-1 text-sm text-red-600">{errors.freight.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-2">
                    Seguro <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("insurance", { 
                      required: "El seguro es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor o igual a 0" }
                    })}
                    type="number"
                    step="0.01"
                    id="insurance"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.insurance && (
                    <p className="mt-1 text-sm text-red-600">{errors.insurance.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dai" className="block text-sm font-medium text-gray-700 mb-2">
                    DAI <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("dai", { 
                      required: "El DAI es requerido",
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor o igual a 0" }
                    })}
                    type="number"
                    step="0.01"
                    id="dai"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.dai && (
                    <p className="mt-1 text-sm text-red-600">{errors.dai.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="other_expenses" className="block text-sm font-medium text-gray-700 mb-2">
                    Otros Gastos <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("other_expenses", { 
                      required: "Los otros gastos son requeridos",
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor o igual a 0" }
                    })}
                    type="number"
                    step="0.01"
                    id="other_expenses"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.other_expenses && (
                    <p className="mt-1 text-sm text-red-600">{errors.other_expenses.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="iva_percentage" className="block text-sm font-medium text-gray-700 mb-2">
                    IVA (%)
                  </label>
                  <input
                    {...register("iva_percentage", { 
                      valueAsNumber: true,
                      min: { value: 0, message: "Debe ser mayor o igual a 0" },
                      max: { value: 100, message: "Debe ser menor o igual a 100" }
                    })}
                    type="number"
                    step="0.01"
                    id="iva_percentage"
                    placeholder="15.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  />
                  {errors.iva_percentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.iva_percentage.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="bg-indigo-50 rounded-lg p-4 space-y-2">
              <h3 className="text-sm font-semibold text-indigo-900 mb-3">Valores Calculados</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-700">CIF Total (FOB + Flete + Seguro):</span>
                <span className="font-bold text-indigo-900">{formatCurrency(calculateCIF())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-700">IVA ({ivaPercentage}%):</span>
                <span className="font-bold text-indigo-900">{formatCurrency(calculateIVA())}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
                  isEditing ? "Actualizar Retaceo" : "Crear Retaceo"
                )}
              </button>
            </div>
          </form>
        }
        onClose={handleCloseModal}
        open={open}
      />
    </div>
  );
};
