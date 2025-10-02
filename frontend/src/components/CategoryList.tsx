import { useState } from "react";
import { useCategoryService } from "../hooks/useCategory.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { CategoryI } from "../interfaces/Category.interfaces";
import { useAlertsService } from "../hooks/useAlerts.service";
import { Plus, Edit, Trash2, FolderOpen, Search, Filter } from "lucide-react";

export const CategoryList = () => {
  const { categories, create, deleted, update } = useCategoryService();
  const { showAlert } = useAlertsService();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<CategoryI>>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleEditCategory = (category: CategoryI) => {
    setIsEditing(true);
    setValue("id", category.id);
    setValue("name", category.name);
    setValue("description", category.description);
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
    reset();
    setIsEditing(false);
  };

  const handleSubmitCategory = async (data: Partial<CategoryI>) => {
    try {
      if (isEditing && data.id) {
        await update(`${data.id}`, data);
        showAlert(
          "Categoría Actualizada",
          "dark",
          "success",
          "¡Categoría actualizada exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Categoría Creada",
          "dark",
          "success",
          "¡Categoría creada exitosamente!"
        );
      }
      reset();
      handleModalClose();
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleted(`${id}`);
      showAlert(
        "Categoría Eliminada",
        "dark",
        "success",
        "¡Categoría eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar la categoría."
      );
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FolderOpen className="h-8 w-8 text-blue-600" />
                Gestión de Categorías
              </h1>
              <p className="text-gray-600 mt-2">
                Administra y organiza las categorías de tu aplicación
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-black px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nueva Categoría
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                <input
                  type="text"
                  placeholder="Buscar categorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <button className="btn btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2 text-black">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="btn btn-ghost btn-sm p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Editar categoría"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn btn-ghost btn-sm p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ID: {category.id}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Categoría
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron categorías" : "No hay categorías"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza creando tu primera categoría"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primera Categoría
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Categoría" : "Nueva Categoría"}
        content={
          <form onSubmit={handleSubmit(handleSubmitCategory)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría
              </label>
              <input
                {...register("name", { 
                  required: "El nombre es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                })}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Ej: Electrónicos, Ropa, Hogar..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                {...register("description", { 
                  required: "La descripción es requerida",
                  minLength: {
                    value: 10,
                    message: "La descripción debe tener al menos 10 caracteres"
                  }
                })}
                id="description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                placeholder="Describe brevemente esta categoría..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleModalClose}
                className="btn btn-outline border-gray-300 hover:bg-gray-50 px-6 py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Categoría" : "Crear Categoría"
                )}
              </button>
            </div>
          </form>
        }
        onClose={handleModalClose}
        open={open}
      />
    </div>
  );
};
