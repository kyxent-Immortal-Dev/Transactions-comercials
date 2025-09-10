import { ModalComponent } from "./ModalComponent";
import { useCategoryService } from "../hooks/useCategory.service";
import { useState } from "react";
import { useSubCategoryService } from "../hooks/useSubCategory.service";
import type { SubCategory } from "../interfaces/SubCategory.interface";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Layers, Search, Filter, FolderOpen } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const SubCategoryComponent = () => {
  const { categories } = useCategoryService();
  const { subCategories, create, deleted, updated } = useSubCategoryService();
  const { showAlert } = useAlertsService();
  
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<Partial<SubCategory>>({
    defaultValues: {
      name: "",
      description: "",
      categoryid: 0,
    },
  });

  const handleEditSubCategory = (item: Partial<SubCategory>) => {
    setIsEditing(true);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("categoryid", item.categoryid);
    setValue("id", item.id);
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset();
    setIsEditing(false);
  };

  const handleSubmitSubCategory = async (data: Partial<SubCategory>) => {
    try {
      if (isEditing && data.id) {
        await updated(`${data.id}`, data);
        showAlert(
          "Subcategoría Actualizada",
          "dark",
          "success",
          "¡Subcategoría actualizada exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Subcategoría Creada",
          "dark",
          "success",
          "¡Subcategoría creada exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteSubCategory = async (id: number) => {
    try {
      await deleted(`${id}`);
      showAlert(
        "Subcategoría Eliminada",
        "dark",
        "success",
        "¡Subcategoría eliminada exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar la subcategoría."
      );
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "Categoría no encontrada";
  };

  const filteredSubCategories = subCategories.filter(
    (subCategory) =>
      subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subCategory.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(subCategory.categoryid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-black bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Layers className="h-8 w-8 text-purple-600" />
                Gestión de Subcategorías
              </h1>
              <p className="text-gray-600 mt-2">
                Administra las subcategorías de tu aplicación
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nueva Subcategoría
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar subcategorías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4  "  />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* SubCategories Grid */}
        {filteredSubCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubCategories.map((subCategory) => (
              <div
                key={subCategory.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditSubCategory(subCategory)}
                        className="btn btn-ghost btn-sm p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        title="Editar subcategoría"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubCategory(subCategory.id)}
                        className="btn btn-ghost btn-sm p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Eliminar subcategoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {subCategory.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {subCategory.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FolderOpen className="h-3 w-3" />
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {getCategoryName(subCategory.categoryid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {subCategory.id}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        Subcategoría
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron subcategorías" : "No hay subcategorías"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza creando tu primera subcategoría"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primera Subcategoría
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Subcategoría" : "Nueva Subcategoría"}
        content={
          <form onSubmit={handleSubmit(handleSubmitSubCategory)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Subcategoría
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Ej: Smartphones, Laptops, Tablets..."
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                placeholder="Describe brevemente esta subcategoría..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="categoryid" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría Padre
              </label>
              <select
                {...register("categoryid", {
                  required: "La categoría es requerida",
                })}
                id="categoryid"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryid && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryid.message}</p>
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
                className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Subcategoría" : "Crear Subcategoría"
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
