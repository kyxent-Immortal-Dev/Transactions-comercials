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
      price: undefined, // No se asigna precio en creación
      amount: 0, // Stock se actualiza con las compras
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
                      <div className="flex items-center gap-2 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {product.price && product.price > 0 ? (
                          <span className="text-green-600">${product.price.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Sin precio</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Hash className="h-3 w-3" />
                        <span>{product.amount} unidades</span>
                      </div>
                    </div>

                    {/* Indicador de estado de precio */}
                    {(!product.price || product.price === 0) && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-2 py-1">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Pendiente de retaceo
                        </p>
                      </div>
                    )}

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
              {/* Campo de Precio - Solo visible en edición y read-only */}
              {isEditing && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio de Venta
                    <span className="text-xs text-gray-500 ml-2">(Solo lectura)</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register("price")}
                      type="number"
                      step="0.01"
                      id="price"
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      placeholder="Se asignará después del retaceo"
                    />
                  </div>
                  <p className="mt-1 text-xs text-blue-600">
                    ℹ️ El precio se asigna automáticamente después del proceso de retaceo
                  </p>
                </div>
              )}

              {/* Campo de Stock/Cantidad - Solo visible en edición y read-only */}
              {isEditing && (
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Disponible
                    <span className="text-xs text-gray-500 ml-2">(Solo lectura)</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register("amount")}
                      type="number"
                      id="amount"
                      readOnly
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      placeholder="Se actualiza con las compras"
                    />
                  </div>
                  <p className="mt-1 text-xs text-blue-600">
                    ℹ️ El stock se actualiza automáticamente al recibir compras
                  </p>
                </div>
              )}
            </div>

            {/* Mensaje informativo al crear producto */}
            {!isEditing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      ℹ️ Sobre el Precio y Stock del Producto
                    </h4>
                    <p className="text-sm text-blue-700 mb-2">
                      El precio de venta y el stock se gestionan automáticamente:
                    </p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-blue-800">📊 Stock:</p>
                        <ul className="mt-1 text-sm text-blue-700 list-disc list-inside ml-2">
                          <li>Se actualiza automáticamente al recibir compras</li>
                          <li>Se reduce automáticamente con las ventas</li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">💰 Precio:</p>
                        <ul className="mt-1 text-sm text-blue-700 list-disc list-inside ml-2">
                          <li>Registro de gastos en la bitácora</li>
                          <li>Cálculo del retaceo (prorrateo de costos)</li>
                          <li>Análisis de precios con margen de utilidad</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
