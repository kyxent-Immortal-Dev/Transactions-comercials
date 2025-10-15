import { useState } from "react";
import { usePrice } from "../hooks/usePrice.service";
import { useProductService } from "../hooks/useProduct.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import type { Price, CreatePriceRequest } from "../interfaces/Price.interface";
import { Plus, Edit, Trash2, DollarSign, Search, Calendar, TrendingUp } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const PriceComponent = () => {
  const { prices, createPrice, updatePrice, deletePrice, loading } = usePrice();
  const { products } = useProductService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreatePriceRequest>({
    defaultValues: {
      product_id: 0,
      bill_cost: 0,
      final_bill_retaceo: 0,
      price: 0,
      utility: 0,
      date: "",
    },
  });

  // Watch para calcular automáticamente
  const finalBillRetaceo = watch("final_bill_retaceo");
  const priceValue = watch("price");

  // Calcular utilidad automáticamente
  const calculateUtility = (price: number, cost: number) => {
    if (cost > 0) {
      return ((price - cost) / cost) * 100;
    }
    return 0;
  };

  const handleEditPrice = (item: Price) => {
    setIsEditing(true);
    setEditingPriceId(item.id || null);
    setValue("product_id", item.product_id);
    setValue("bill_cost", item.bill_cost);
    setValue("final_bill_retaceo", item.final_bill_retaceo);
    setValue("price", item.price);
    setValue("utility", item.utility);
    setValue("date", item.date ? new Date(item.date).toISOString().split('T')[0] : "");
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setValue("date", new Date().toISOString().split('T')[0]);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleSubmitPrice = async (data: CreatePriceRequest) => {
    try {
      // Calcular utilidad antes de enviar y asegurar que product_id sea número
      const utility = calculateUtility(data.price, data.final_bill_retaceo);
      const priceData = {
        ...data,
        product_id: Number(data.product_id),
        bill_cost: Number(data.bill_cost),
        final_bill_retaceo: Number(data.final_bill_retaceo),
        price: Number(data.price),
        utility
      };

      if (isEditing && editingPriceId) {
        await updatePrice(editingPriceId, priceData);
        showAlert(
          "Precio Actualizado",
          "dark",
          "success",
          "¡Precio actualizado exitosamente!"
        );
      } else {
        await createPrice(priceData);
        showAlert(
          "Precio Creado",
          "dark",
          "success",
          "¡Precio creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitPrice:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeletePrice = async (id: number) => {
    try {
      await deletePrice(id);
      showAlert(
        "Precio Eliminado",
        "dark",
        "success",
        "¡Precio eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Error al eliminar el precio"
      );
    }
  };

  const filteredPrices = prices.filter(price => {
    const matchesSearch = 
      price.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = selectedProductId === null || price.product_id === selectedProductId;
    
    return matchesSearch && matchesProduct;
  });

  // Calcular utilidad en tiempo real para mostrar
  const currentUtility = calculateUtility(priceValue, finalBillRetaceo);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <DollarSign className="text-green-600" size={40} />
              Precios Actuales
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona los precios de venta de los productos
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Nuevo Precio
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Product Filter */}
          <select
            value={selectedProductId || 0}
            onChange={(e) => setSelectedProductId(Number(e.target.value) || null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={0}>Todos los Productos</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          {/* Results Count */}
          <div className="flex items-center justify-end text-gray-600">
            <span className="font-semibold">{filteredPrices.length}</span>
            <span className="ml-2">resultados</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Producto</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Costo Factura</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Costo Final</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Precio Venta</th>
                <th className="px-6 py-4 text-right text-sm font-semibold">Utilidad %</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Cargando precios...
                  </td>
                </tr>
              ) : filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron precios
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price) => (
                  <tr key={price.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {price.product?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      ${price.bill_cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">
                      ${price.final_bill_retaceo.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-green-700">
                      ${price.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        price.utility >= 30 ? 'text-green-600' :
                        price.utility >= 15 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        <TrendingUp size={14} />
                        {price.utility.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        {price.date ? new Date(price.date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditPrice(price)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePrice(price.id)}
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
        title={isEditing ? "Editar Precio" : "Nuevo Precio"}
        content={
          <form onSubmit={handleSubmit(handleSubmitPrice)} className="space-y-6">
            {/* Producto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Producto *
              </label>
              <select
                {...register("product_id", {
                  required: "El producto es obligatorio",
                  validate: (value) => value > 0 || "Debe seleccionar un producto válido",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar Producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {errors.product_id && (
                <p className="mt-1 text-sm text-red-600">{errors.product_id.message}</p>
              )}
            </div>

            {/* Costos en una fila */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo Factura *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("bill_cost", {
                    required: "El costo de factura es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.bill_cost && (
                  <p className="mt-1 text-sm text-red-600">{errors.bill_cost.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Costo Final (con retaceo) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("final_bill_retaceo", {
                    required: "El costo final es obligatorio",
                    min: { value: 0, message: "Debe ser mayor o igual a 0" },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
                {errors.final_bill_retaceo && (
                  <p className="mt-1 text-sm text-red-600">{errors.final_bill_retaceo.message}</p>
                )}
              </div>
            </div>

            {/* Precio de venta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio de Venta *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "El precio de venta es obligatorio",
                  min: { value: 0, message: "Debe ser mayor o igual a 0" },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            {/* Mostrar utilidad calculada */}
            {finalBillRetaceo > 0 && priceValue > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Utilidad Estimada:</span>
                  <span className={`text-lg font-bold ${
                    currentUtility >= 30 ? 'text-green-600' :
                    currentUtility >= 15 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {currentUtility.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  Ganancia: ${(priceValue - finalBillRetaceo).toFixed(2)}
                </div>
              </div>
            )}

            {/* Fecha */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
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
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
