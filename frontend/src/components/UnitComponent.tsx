import { useState } from "react";
import { useUnitService } from "../hooks/useUnit.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import { Unit, CreateUnitRequest, UpdateUnitRequest } from "../interfaces/Unit.interface";
import { Plus, Edit, Trash2, Scale, Search, Filter } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const UnitComponent = () => {
  const { units, create, update, deleteUnit, loading } = useUnitService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateUnitRequest>({
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const handleEditUnit = (item: Unit) => {
    setIsEditing(true);
    setEditingUnitId(item.id || null);
    setValue("name", item.name || "");
    setValue("type", item.type || "");
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

  const handleSubmitUnit = async (data: CreateUnitRequest) => {
    try {
      if (isEditing && editingUnitId) {
        await update(editingUnitId, data);
        showAlert(
          "Unidad Actualizada",
          "dark",
          "success",
          "¡Unidad actualizada exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Unidad Creada",
          "dark",
          "success",
          "¡Unidad creada exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitUnit:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteUnit = async (id: number) => {
    try {
      await deleteUnit(id);
      showAlert(
        "Unidad Eliminada",
        "dark",
        "success",
        "¡Unidad eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar la unidad."
      );
    }
  };

  const filteredUnits = units.filter(
    (unit) =>
      unit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Scale className="h-8 w-8 text-blue-600" />
                Gestión de Unidades
              </h1>
              <p className="text-gray-600 mt-2">
                Administra las unidades de medida del sistema
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nueva Unidad
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar unidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Units Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUnits.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tipo</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Scale className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{unit.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {unit.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUnit(unit)}
                            className="btn btn-outline btn-sm border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200"
                            title="Editar unidad"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => unit.id && handleDeleteUnit(unit.id)}
                            className="btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                            title="Eliminar unidad"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron unidades" : "No hay unidades"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza agregando tu primera unidad"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Agregar Primera Unidad
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Unidad" : "Nueva Unidad"}
        content={
          <form onSubmit={handleSubmit(handleSubmitUnit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Unidad
              </label>
              <input
                {...register("name", { 
                  required: "El nombre de la unidad es requerido",
                  minLength: {
                    value: 1,
                    message: "El nombre debe tener al menos 1 caracter"
                  }
                })}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="ej. Kilogramo, Litro, Pieza"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                {...register("type", { 
                  required: "El tipo de unidad es requerido"
                })}
                id="type"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Selecciona un tipo</option>
                <option value="peso">Peso</option>
                <option value="volumen">Volumen</option>
                <option value="longitud">Longitud</option>
                <option value="cantidad">Cantidad</option>
                <option value="tiempo">Tiempo</option>
                <option value="otros">Otros</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
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
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Unidad" : "Crear Unidad"
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