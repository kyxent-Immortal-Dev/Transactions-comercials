import { useState } from "react";
import { useProductService } from "../hooks/useProduct.service";
import { ModalComponent } from "./ModalComponent";
import { useSubCategoryService } from "../hooks/useSubCategory.service";
import { useForm } from "react-hook-form";
import type { ProductInterface } from "../interfaces/Product.interface";
import { Plus, Edit, Trash2, Package, Search, Filter, DollarSign, Hash, Image as ImageIcon } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const ProductComponent = () => {
  const { products, create, updated, deleted } = useProductService();
  const { subCategories } = useSubCategoryService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Partial<ProductInterface>>({
    defaultValues: {
      image: "",
      name: "",
      description: "",
      price: 0,
      amount: 0,
      subcategoriesid: 0,
    },
  });

  const handleEditProduct = (item: Partial<ProductInterface>) => {
    setIsEditing(true);
    setValue("id", item.id);
    setValue("image", item.image);
    setValue("name", item.name);
    setValue("description", item.description);
    setValue("price", item.price);
    setValue("amount", item.amount);
    setValue("subcategoriesid", item.subcategoriesid);
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

  const handleSubmitProduct = async (data: Partial<ProductInterface>) => {
    try {
      if (isEditing && data.id) {
        await updated(`${data.id}`, data);
        showAlert(
          "Producto Actualizado",
          "dark",
          "success",
          "¡Producto actualizado exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Producto Creado",
          "dark",
          "success",
          "¡Producto creado exitosamente!"
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

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleted(`${id}`);
      showAlert(
        "Producto Eliminado",
        "dark",
        "success",
        "¡Producto eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar el producto."
      );
    }
  };

  const getSubCategoryName = (subCategoryId: number) => {
    const subCategory = subCategories.find(sub => sub.id === subCategoryId);
    return subCategory?.name || "Subcategoría no encontrada";
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSubCategoryName(product.subcategoriesid).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="h-8 w-8 text-green-600" />
                Gestión de Productos
              </h1>
              <p className="text-gray-600 mt-2">
                Administra el catálogo de productos de tu aplicación
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nuevo Producto
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4 " />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Product Image */}
                  <div className="mb-4">
                    <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>${product.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Hash className="h-3 w-3" />
                        <span>{product.amount} unidades</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {getSubCategoryName(product.subcategoriesid)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 btn btn-outline btn-sm border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 transition-colors duration-200"
                      title="Editar producto"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar producto"
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
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron productos" : "No hay productos"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza creando tu primer producto"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Crear Primer Producto
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Producto" : "Nuevo Producto"}
        content={
          <form onSubmit={handleSubmit(handleSubmitProduct)} className="space-y-6">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                {...register("image", { 
                  required: "La imagen es requerida",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Debe ser una URL válida"
                  }
                })}
                type="url"
                id="image"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Producto
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                placeholder="Ej: iPhone 15, MacBook Pro..."
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 resize-none"
                placeholder="Describe el producto..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio
                </label>
                <input
                  {...register("price", { 
                    required: "El precio es requerido",
                    min: {
                      value: 0,
                      message: "El precio debe ser mayor a 0"
                    }
                  })}
                  type="number"
                  step="0.01"
                  id="price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <input
                  {...register("amount", { 
                    required: "La cantidad es requerida",
                    min: {
                      value: 0,
                      message: "La cantidad debe ser mayor o igual a 0"
                    }
                  })}
                  type="number"
                  id="amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  placeholder="0"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="subcategoriesid" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategoría
              </label>
              <select
                {...register("subcategoriesid", {
                  required: "La subcategoría es requerida",
                })}
                id="subcategoriesid"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
              >
                <option value="">Selecciona una subcategoría</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategoriesid && (
                <p className="mt-1 text-sm text-red-600">{errors.subcategoriesid.message}</p>
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
                className="btn btn-primary bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Producto" : "Crear Producto"
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
