import { useState } from "react";
import { usePriceAnalysis } from "../hooks/usePriceAnalysis.service";
import { useRetaceoService } from "../hooks/useRetaceo.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { PriceAnalysis, CreatePriceAnalysisRequest } from "../interfaces/PriceAnalysis.interface";
import { Plus, Edit, Trash2, TrendingUp, Search, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const PriceAnalysisComponent = () => {
  const { priceAnalyses, createPriceAnalysis, updatePriceAnalysis, deletePriceAnalysis, loading } = usePriceAnalysis();
  const { retaceos } = useRetaceoService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnalysisId, setEditingAnalysisId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRetaceoId, setSelectedRetaceoId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreatePriceAnalysisRequest>({
    defaultValues: {
      retaceo_id: 0,
      date: "",
      status: "pending",
    },
  });

  const handleEditAnalysis = (item: PriceAnalysis) => {
    setIsEditing(true);
    setEditingAnalysisId(item.id || null);
    setValue("retaceo_id", item.retaceo_id);
    setValue("date", item.date ? new Date(item.date).toISOString().split('T')[0] : "");
    setValue("status", item.status || "pending");
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setValue("date", new Date().toISOString().split('T')[0]);
    setValue("status", "pending");
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleRetaceoChange = (retaceoId: number) => {
    setSelectedRetaceoId(retaceoId === 0 ? null : retaceoId);
  };

  const handleSubmitAnalysis = async (data: CreatePriceAnalysisRequest) => {
    try {
      // Asegurarse de que retaceo_id sea un número
      const priceAnalysisData = {
        ...data,
        retaceo_id: Number(data.retaceo_id)
      };

      if (isEditing && editingAnalysisId) {
        await updatePriceAnalysis(editingAnalysisId, priceAnalysisData);
        showAlert(
          "Análisis Actualizado",
          "dark",
          "success",
          "¡Análisis de precio actualizado exitosamente!"
        );
      } else {
        await createPriceAnalysis(priceAnalysisData);
        showAlert(
          "Análisis Creado",
          "dark",
          "success",
          "¡Análisis de precio creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitAnalysis:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteAnalysis = async (id: number) => {
    try {
      await deletePriceAnalysis(id);
      showAlert(
        "Análisis Eliminado",
        "dark",
        "success",
        "¡Análisis de precio eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Error al eliminar el análisis"
      );
    }
  };

  const filteredAnalyses = priceAnalyses.filter(analysis => {
    const matchesSearch = 
      analysis.retaceo?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.retaceo?.purchase?.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRetaceo = selectedRetaceoId === null || analysis.retaceo_id === selectedRetaceoId;
    const matchesStatus = !selectedStatus || analysis.status === selectedStatus;
    
    return matchesSearch && matchesRetaceo && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="text-purple-600" size={40} />
              Análisis de Precios
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona los análisis de precios basados en retaceos
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Nuevo Análisis
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar análisis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Retaceo Filter */}
          <select
            value={selectedRetaceoId || 0}
            onChange={(e) => handleRetaceoChange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={0}>Todos los Retaceos</option>
            {retaceos.map((retaceo) => (
              <option key={retaceo.id} value={retaceo.id}>
                {retaceo.code} - {retaceo.purchase?.supplier?.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los Estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-end text-gray-600">
            <span className="font-semibold">{filteredAnalyses.length}</span>
            <span className="ml-2">resultados</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Retaceo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proveedor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Cargando análisis de precios...
                  </td>
                </tr>
              ) : filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron análisis de precios
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      #{analysis.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {analysis.retaceo?.code || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {analysis.retaceo?.purchase?.supplier?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {analysis.date ? new Date(analysis.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          analysis.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : analysis.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {analysis.status === 'approved' && (
                          <CheckCircle size={14} className="inline mr-1" />
                        )}
                        {analysis.status === 'rejected' && (
                          <XCircle size={14} className="inline mr-1" />
                        )}
                        {analysis.status === 'approved' ? 'Aprobado' : 
                         analysis.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditAnalysis(analysis)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAnalysis(analysis.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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
        title={isEditing ? "Editar Análisis de Precio" : "Nuevo Análisis de Precio"}
        content={
          <form onSubmit={handleSubmit(handleSubmitAnalysis)} className="space-y-6">
            {/* Retaceo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Retaceo *
              </label>
              <select
                {...register("retaceo_id", {
                  required: "El retaceo es obligatorio",
                  validate: (value) => value > 0 || "Debe seleccionar un retaceo válido",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar Retaceo</option>
                {retaceos.map((retaceo) => (
                  <option key={retaceo.id} value={retaceo.id}>
                    {retaceo.code} - {retaceo.purchase?.supplier?.name}
                  </option>
                ))}
              </select>
              {errors.retaceo_id && (
                <p className="mt-1 text-sm text-red-600">{errors.retaceo_id.message}</p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado *
              </label>
              <select
                {...register("status", { required: "El estado es obligatorio" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
