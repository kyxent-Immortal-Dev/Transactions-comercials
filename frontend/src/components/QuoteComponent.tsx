import { useState } from "react";
import { useQuoteService } from "../hooks/useQuote.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import { Quote, CreateQuoteRequest, UpdateQuoteRequest } from "../interfaces/Quote.interface";
import { Plus, Edit, Trash2, FileText, Search, Filter, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const QuoteComponent = () => {
  const { quotes, create, update, deleteQuote, loading, getBySupplierId } = useQuoteService();
  const { suppliers } = useSupplierService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateQuoteRequest>({
    defaultValues: {
      supplier_id: 0,
      code: "",
      status: "pending",
    },
  });

  const handleEditQuote = (item: Quote) => {
    setIsEditing(true);
    setEditingQuoteId(item.id || null);
    setValue("supplier_id", item.supplier_id);
    setValue("code", item.code || "");
    setValue("status", item.status || "pending");
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

  const handleSubmitQuote = async (data: CreateQuoteRequest) => {
    try {
      if (isEditing && editingQuoteId) {
        await update(editingQuoteId, data);
        showAlert(
          "Cotización Actualizada",
          "dark",
          "success",
          "¡Cotización actualizada exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Cotización Creada",
          "dark",
          "success",
          "¡Cotización creada exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitQuote:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteQuote = async (id: number) => {
    try {
      await deleteQuote(id);
      showAlert(
        "Cotización Eliminada",
        "dark",
        "success",
        "¡Cotización eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar la cotización."
      );
    }
  };

  const handleSupplierFilter = async (supplierId: number | null) => {
    setSelectedSupplierId(supplierId);
    if (supplierId) {
      await getBySupplierId(supplierId);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  const filteredQuotes = quotes.filter(
    (quote) =>
      (selectedSupplierId === null || quote.supplier_id === selectedSupplierId) &&
      (selectedStatus === "" || quote.status === selectedStatus) &&
      (quote.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                Gestión de Cotizaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Administra las cotizaciones de proveedores
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nueva Cotización
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cotizaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>
              <select
                value={selectedSupplierId || ""}
                onChange={(e) => handleSupplierFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
              </select>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Quotes Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Quote Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(quote.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quote.code || `COT-${quote.id}`}
                    </h3>
                  </div>

                  {/* Quote Info */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Proveedor:</p>
                      <p className="font-medium text-gray-900">{quote.supplier?.name}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(quote.date || '').toLocaleDateString()}</span>
                    </div>

                    {quote.quote_details && quote.quote_details.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600">Items:</p>
                        <p className="font-medium text-gray-900">{quote.quote_details.length} productos</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditQuote(quote)}
                      className="flex-1 btn btn-outline btn-sm border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 transition-colors duration-200"
                      title="Editar cotización"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => quote.id && handleDeleteQuote(quote.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar cotización"
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
              {searchTerm || selectedSupplierId || selectedStatus ? "No se encontraron cotizaciones" : "No hay cotizaciones"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSupplierId || selectedStatus
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Comienza creando tu primera cotización"
              }
            </p>
            {!searchTerm && !selectedSupplierId && !selectedStatus && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primera Cotización
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Cotización" : "Nueva Cotización"}
        content={
          <form onSubmit={handleSubmit(handleSubmitQuote)} className="space-y-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Código de Cotización
              </label>
              <input
                {...register("code")}
                type="text"
                id="code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="COT-001 (opcional)"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                {...register("status")}
                id="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
              </select>
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
                className="btn btn-primary bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Cotización" : "Crear Cotización"
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