import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Edit, Trash2, Eye, Minus, X, Package, FileText, User } from "lucide-react";
import { useQuoteService } from "../hooks/useQuote.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { useProductService } from "../hooks/useProduct.service";
import { useAlertsService } from "../hooks/useAlerts.service";
import { ModalComponent } from "./ModalComponent";

import type { Quote, QuoteDetail, CreateQuoteRequest } from "../interfaces/Quote.interface";

// Interface específica para el formulario
interface QuoteFormData {
  supplier_id: string; 
  code: string;
  status: string;
  quote_details: {
    product_id: string; 
    quantity_req: number;
    unit: string;
  }[];
}

export const QuoteComponent = () => {
  const { quotes, create, update, deleteQuote, getDetailsByQuoteId, createDetail, updateDetail, deleteQuoteDetail } = useQuoteService();
  const { suppliers } = useSupplierService();
  const { products } = useProductService();
  const { showAlert } = useAlertsService();

  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetail[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<QuoteFormData>({
    defaultValues: {
      supplier_id: "",
      code: "",
      status: "pending",
      quote_details: [{ product_id: "", quantity_req: 1, unit: "unidad" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quote_details"
  });

  // Obtener el proveedor seleccionado para mostrar su nombre
  const getSupplierName = (supplierId: number) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || "Proveedor no encontrado";
  };

  // Obtener el producto seleccionado para mostrar su nombre
  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product?.name || "Producto no encontrado";
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset({
      supplier_id: "",
      code: "",
      status: "pending",
      quote_details: [{ product_id: "", quantity_req: 1, unit: "unidad" }]
    });
    setOpenModal(true);
  };

  const handleEdit = (quote: Quote) => {
    setIsEditing(true);
    setValue("supplier_id", quote.supplier_id.toString());
    setValue("code", quote.code || "");
    setValue("status", quote.status || "pending");
    
    // Si la cotización tiene detalles, los cargamos
    if (quote.quote_details && quote.quote_details.length > 0) {
      setValue("quote_details", quote.quote_details.map((detail: QuoteDetail) => ({
        product_id: detail.product_id.toString(),
        quantity_req: detail.quantity_req || 1,
        unit: detail.unit || "unidad"
      })));
    } else {
      setValue("quote_details", [{ product_id: "", quantity_req: 1, unit: "unidad" }]);
    }
    
    setSelectedQuoteId(quote.id!);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setSelectedQuoteId(null);
    reset();
  };

  const handleViewDetails = async (quoteId: number) => {
    try {
      const details = await getDetailsByQuoteId(quoteId);
      setQuoteDetails(details || []);
      setSelectedQuoteId(quoteId);
      setOpenDetailModal(true);
    } catch (error) {
      console.error('Error loading details:', error);
      showAlert("Error", "dark", "error", "No se pudieron cargar los detalles");
    }
  };

  const onSubmit = async (data: QuoteFormData) => {
    try {
      console.log('Form data submitted:', data); // Debug

      // Validar que se haya seleccionado un proveedor
      if (!data.supplier_id || data.supplier_id === "" || data.supplier_id === "0") {
        showAlert("Error", "dark", "error", "Debe seleccionar un proveedor");
        return;
      }

      // Validar que haya al menos un producto válido
      const validDetails = data.quote_details.filter(detail => 
        detail.product_id && 
        detail.product_id !== "" && 
        detail.product_id !== "0" && 
        detail.quantity_req > 0
      );

      if (validDetails.length === 0) {
        showAlert("Error", "dark", "error", "Debe seleccionar al menos un producto");
        return;
      }

      // Validar que no existan productos duplicados en el formulario
      const productIds = validDetails.map(d => parseInt(d.product_id, 10));
      const hasDuplicates = new Set(productIds).size !== productIds.length;
      if (hasDuplicates) {
        showAlert("Error", "dark", "error", "Hay productos repetidos en la cotización. Elimine duplicados antes de guardar.");
        return;
      }

      // Preparar datos para crear la cotización
      const quoteData: CreateQuoteRequest = {
        supplier_id: parseInt(data.supplier_id, 10),
        code: data.code.trim(),
        status: data.status
      };

      console.log('Sending quote data:', quoteData); // Debug

      if (isEditing && selectedQuoteId) {
        await update(selectedQuoteId, {
          supplier_id: quoteData.supplier_id,
          code: quoteData.code,
          status: quoteData.status
        });

        const existingDetails = await getDetailsByQuoteId(selectedQuoteId);

        const existingByProduct = new Map<number, QuoteDetail[]>();
        for (const det of existingDetails) {
          const arr = existingByProduct.get(det.product_id) || [];
          arr.push(det);
          existingByProduct.set(det.product_id, arr);
        }

        for (const [prodId, arr] of existingByProduct.entries()) {
          if (arr.length > 1) {
            const [, ...dups] = arr;
            for (const dup of dups) {
              if (dup.id) {
                await deleteQuoteDetail(dup.id, selectedQuoteId);
              }
            }
            existingByProduct.set(prodId, [arr[0]]);
          }
        }

        const desiredSet = new Set(productIds);
        const existingSet = new Set(Array.from(existingByProduct.keys()));

        for (const prodId of existingSet) {
          if (!desiredSet.has(prodId)) {
            const detArr = existingByProduct.get(prodId)!;
            const det = detArr[0];
            if (det.id) {
              await deleteQuoteDetail(det.id, selectedQuoteId);
            }
          }
        }

        for (const formDet of validDetails) {
          const prodId = parseInt(formDet.product_id, 10);
          const existing = existingByProduct.get(prodId)?.[0];
          if (existing && existing.id) {
            const needsUpdate = (existing.quantity_req || 0) !== formDet.quantity_req || (existing.unit || "").trim() !== formDet.unit.trim();
            if (needsUpdate) {
              await updateDetail(existing.id, {
                quantity_req: formDet.quantity_req,
                unit: formDet.unit.trim()
              }, selectedQuoteId);
            }
          }
        }

        for (const formDet of validDetails) {
          const prodId = parseInt(formDet.product_id, 10);
          if (!existingByProduct.has(prodId)) {
            await createDetail({
              quote_id: selectedQuoteId,
              product_id: prodId,
              quantity_req: formDet.quantity_req,
              unit: formDet.unit.trim(),
              status: "pending"
            });
          }
        }

        showAlert("Éxito", "dark", "success", "Cotización actualizada y detalles sincronizados correctamente");
      } else {
        // Crear nueva cotización
        const newQuote = await create(quoteData);

        console.log('Created quote:', newQuote); // Debug

        // Crear detalles
        if (newQuote && newQuote.id) {
          for (const detail of validDetails) {
            try {
              await createDetail({
                quote_id: newQuote.id,
                product_id: parseInt(detail.product_id, 10),
                quantity_req: detail.quantity_req,
                unit: detail.unit.trim(),
                status: "pending"
              });
            } catch (detailError) {
              console.warn('Error creating detail:', detailError);
            }
          }
        }

        showAlert("Éxito", "dark", "success", "Cotización creada correctamente");
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Submit error:', error);
      showAlert("Error", "dark", "error", "Ocurrió un error al guardar la cotización. Verifique los datos.");
    }
  };

  const addProduct = () => {
    append({ product_id: "", quantity_req: 1, unit: "unidad" });
  };

  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const incrementQuantity = (index: number) => {
    const currentQuantity = watch(`quote_details.${index}.quantity_req`);
    setValue(`quote_details.${index}.quantity_req`, currentQuantity + 1);
  };

  const decrementQuantity = (index: number) => {
    const currentQuantity = watch(`quote_details.${index}.quantity_req`);
    if (currentQuantity > 1) {
      setValue(`quote_details.${index}.quantity_req`, currentQuantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Gestión de Cotizaciones
            </h1>
            <p className="text-gray-600 mt-2">
              Administra cotizaciones con productos y cantidades
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Nueva Cotización
          </button>
        </div>

        {/* Lista de cotizaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quote.code || `Cotización #${quote.id}`}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    {getSupplierName(quote.supplier_id)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  quote.status === 'approved' ? 'bg-green-100 text-green-700' :
                  quote.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {quote.status === 'pending' ? 'Pendiente' :
                   quote.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                </span>
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <p>Productos: {quote.quote_details?.length || 0}</p>
                <p>Fecha: {quote.date ? new Date(quote.date).toLocaleDateString() : 'N/A'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewDetails(quote.id!)}
                  className="flex-1 btn btn-outline btn-sm border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver Detalles
                </button>
                <button
                  onClick={() => handleEdit(quote)}
                  className="flex-1 btn btn-outline btn-sm border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => deleteQuote(quote.id!)}
                  className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para crear/editar cotización */}
      <ModalComponent
        title={isEditing ? "Editar Cotización" : "Nueva Cotización"}
        open={openModal}
        onClose={handleCloseModal}
        content={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  {...register("supplier_id", { 
                    required: "El proveedor es requerido",
                    validate: value => value !== "" && value !== "0" || "Debe seleccionar un proveedor válido"
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar proveedor</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id?.toString()}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.supplier_id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Cotización {isEditing ? <span className="text-xs text-gray-500">(editable)</span> : <span className="text-xs text-gray-400">(se generará automáticamente)</span>}
                </label>
                <input
                  {...register("code", { 
                    validate: value => {
                      if (!isEditing) return true; 
                      if (isEditing && (!value || value.trim() === '')) return 'El código no puede estar vacío';
                      return true;
                    }
                  })}
                  type="text"
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder={isEditing ? 'Ej: COT-2509-0007' : 'Se generará automáticamente al guardar'}
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="approved">Aprobada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </div>
            </div>

            {/* Productos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Productos</h3>
                <button
                  type="button"
                  onClick={addProduct}
                  className="btn btn-sm btn-outline border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir Producto
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-start gap-4">
                      {/* Selector de producto */}
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Producto *
                        </label>
                        <select
                          {...register(`quote_details.${index}.product_id`, {
                            required: "Selecciona un producto",
                            validate: value => value !== "" && value !== "0" || "Debe seleccionar un producto válido"
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Seleccionar producto</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id?.toString()}>
                              {product.name} - ${product.price}
                            </option>
                          ))}
                        </select>
                        {errors.quote_details?.[index]?.product_id && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.quote_details[index]?.product_id?.message}
                          </p>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad *
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(index)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            {...register(`quote_details.${index}.quantity_req`, {
                              required: true,
                              min: { value: 1, message: "Mínimo 1" },
                              valueAsNumber: true
                            })}
                            type="number"
                            min="1"
                            className="w-full text-center border-0 focus:ring-0 py-1"
                          />
                          <button
                            type="button"
                            onClick={() => incrementQuantity(index)}
                            className="px-2 py-1 text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {errors.quote_details?.[index]?.quantity_req && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.quote_details[index]?.quantity_req?.message}
                          </p>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      {fields.length > 1 && (
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={() => removeProduct(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones del formulario */}
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
                className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 text-white px-6 py-2 disabled:opacity-50"
              >
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"} Cotización
              </button>
            </div>
          </form>
        }
      />

      {/* Modal para ver detalles */}
      <ModalComponent
        title="Detalles de la Cotización"
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        content={
          <div className="space-y-6">
            {selectedQuoteId && (
              <>
                {/* Información de la cotización */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Información General</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Proveedor:</span>
                      <p className="text-gray-600">
                        {getSupplierName(quotes.find(q => q.id === selectedQuoteId)?.supplier_id || 0)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Código:</span>
                      <p className="text-gray-600">
                        {quotes.find(q => q.id === selectedQuoteId)?.code || `#${selectedQuoteId}`}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Estado:</span>
                      <p className="text-gray-600">
                        {quotes.find(q => q.id === selectedQuoteId)?.status === 'pending' ? 'Pendiente' :
                         quotes.find(q => q.id === selectedQuoteId)?.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Fecha:</span>
                      <p className="text-gray-600">
                        {quotes.find(q => q.id === selectedQuoteId)?.date 
                          ? new Date(quotes.find(q => q.id === selectedQuoteId)!.date!).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Productos Cotizados</h3>
                  <div className="space-y-3">
                    {quoteDetails.length > 0 ? (
                      quoteDetails.map((detail, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {getProductName(detail.product_id)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Cantidad solicitada: {detail.quantity_req} {detail.unit || 'unidades'}
                                </p>
                                {detail.price && (
                                  <p className="text-sm text-green-600">
                                    Precio: ${detail.price}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              detail.status === 'approved' ? 'bg-green-100 text-green-700' :
                              detail.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {detail.status === 'pending' ? 'Pendiente' :
                               detail.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No hay productos en esta cotización</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        }
      />
    </div>
  );
};