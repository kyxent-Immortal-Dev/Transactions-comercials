import { useState } from "react";
import { useRetaceoService } from "../hooks/useRetaceo.service";
import { usePurchase } from "../hooks/usePurchase.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { Retaceo, CreateRetaceoRequest } from "../interfaces/Retaceo.interface";
import { Plus, Edit, Trash2, FileText, Search, Calendar, Package, RefreshCw } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";
import { generateRetaceoCode, generateInvoiceNumber, getNextSequence } from "../utils/codeGenerator";

export const RetaceoComponent = () => {
  const { retaceos, create, update, deleteRetaceo, loading } = useRetaceoService();
  const { purchases } = usePurchase();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRetaceoId, setEditingRetaceoId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateRetaceoRequest>({
    defaultValues: {
      code: "",
      num_invoice: "",
      date: "",
      status: "pending",
      purchase_id: 0,
    },
  });

  const handleEditRetaceo = (item: Retaceo) => {
    setIsEditing(true);
    setEditingRetaceoId(item.id || null);
    setValue("code", item.code || "");
    setValue("num_invoice", item.num_invoice || "");
    setValue("date", item.date ? new Date(item.date).toISOString().split('T')[0] : "");
    setValue("status", item.status || "pending");
    setValue("purchase_id", item.purchase_id);
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    
    // Generar código automáticamente
    const existingCodes = retaceos.map(r => r.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "RET");
    const newCode = generateRetaceoCode(nextSeq);
    setValue("code", newCode);
    
    // Generar número de factura automáticamente
    const existingInvoices = retaceos.map(r => r.num_invoice || "").filter(inv => inv);
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

  // Regenerar código manualmente
  const handleRegenerateCode = () => {
    const existingCodes = retaceos.map(r => r.code || "").filter(code => code);
    const nextSeq = getNextSequence(existingCodes, "RET");
    const newCode = generateRetaceoCode(nextSeq);
    setValue("code", newCode);
  };

  // Regenerar número de factura manualmente
  const handleRegenerateInvoice = () => {
    const existingInvoices = retaceos.map(r => r.num_invoice || "").filter(inv => inv);
    const nextInvSeq = getNextSequence(existingInvoices, "INV");
    const newInvoice = generateInvoiceNumber(nextInvSeq);
    setValue("num_invoice", newInvoice);
  };

  const handleSubmitRetaceo = async (data: CreateRetaceoRequest) => {
    try {
      // Asegurar que purchase_id sea número
      const retaceoData = {
        ...data,
        purchase_id: Number(data.purchase_id)
      };

      if (isEditing && editingRetaceoId) {
        await update(editingRetaceoId, retaceoData);
        showAlert(
          "Retaceo Actualizado",
          "dark",
          "success",
          "¡Retaceo actualizado exitosamente!"
        );
      } else {
        await create(retaceoData);
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

  const filteredRetaceos = retaceos.filter(retaceo => {
    const matchesSearch = 
      retaceo.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retaceo.num_invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retaceo.purchase?.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPurchase = selectedPurchaseId === null || retaceo.purchase_id === selectedPurchaseId;
    const matchesStatus = selectedStatus === "" || retaceo.status === selectedStatus;
    
    return matchesSearch && matchesPurchase && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <FileText className="text-purple-600" size={40} />
              Gestión de Retaceos
            </h1>
            <p className="text-gray-600 mt-2">
              Administra los retaceos asociados a compras
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Nuevo Retaceo
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
              placeholder="Buscar por código, factura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Purchase Filter */}
          <div className="relative">
            <select
              value={selectedPurchaseId || ""}
              onChange={(e) => setSelectedPurchaseId(Number(e.target.value) || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Todas las Compras</option>
              {purchases.map((purchase) => (
                <option key={purchase.id} value={purchase.id}>
                  {purchase.code || `#${purchase.id}`} - {purchase.supplier?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="">Todos los Estados</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Retaceos Table */}
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
                  Compra
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Número de Factura
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-3 text-gray-600">Cargando retaceos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRetaceos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron retaceos
                  </td>
                </tr>
              ) : (
                filteredRetaceos.map((retaceo) => (
                  <tr
                    key={retaceo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      #{retaceo.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {retaceo.code || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="text-purple-600" size={16} />
                        <span className="font-medium text-gray-900">
                          {retaceo.purchase?.code || `#${retaceo.purchase_id}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {retaceo.num_invoice || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar className="text-gray-500" size={16} />
                        {retaceo.date ? new Date(retaceo.date).toLocaleDateString('es-ES') : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        retaceo.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : retaceo.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : retaceo.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {retaceo.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditRetaceo(retaceo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => retaceo.id && handleDeleteRetaceo(retaceo.id)}
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
        title={isEditing ? "Editar Retaceo" : "Nuevo Retaceo"}
        content={
          <form onSubmit={handleSubmit(handleSubmitRetaceo)} className="space-y-6">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("code")}
                  placeholder="RET-20251013-0001"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleRegenerateCode}
                    className="px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    title="Regenerar código"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">El código se genera automáticamente</p>
            </div>

            {/* Purchase Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compra *
              </label>
              <select
                {...register("purchase_id", {
                  required: "La compra es requerida",
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Seleccione una compra</option>
                {purchases.map((purchase) => (
                  <option key={purchase.id} value={purchase.id}>
                    {purchase.code || `#${purchase.id}`} - {purchase.buy_order?.code} - {purchase.supplier?.name}
                  </option>
                ))}
              </select>
              {errors.purchase_id && (
                <p className="mt-1 text-sm text-red-600">{errors.purchase_id.message}</p>
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleRegenerateInvoice}
                    className="px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors duration-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
