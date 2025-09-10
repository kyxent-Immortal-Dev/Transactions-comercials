import { useState } from "react";
import { useSupplierService } from "../hooks/useSupplier.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "../interfaces/Supplier.interface";
import { Plus, Edit, Trash2, Truck, Search, Filter, Phone, Mail, MapPin, Building, User } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const SupplierComponent = () => {
  const { suppliers, create, update, deleteSupplier, loading } = useSupplierService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateSupplierRequest>({
    defaultValues: {
      name: "",
      country: "",
      address: "",
      phone: "",
      email: "",
      isActive: true,
    },
  });

  const handleEditSupplier = (item: Supplier) => {
    setIsEditing(true);
    setEditingSupplierId(item.id || null);
    setValue("name", item.name || "");
    setValue("country", item.country || "");
    setValue("address", item.address || "");
    setValue("phone", item.phone || "");
    setValue("email", item.email || "");
    setValue("isActive", item.isActive || true);
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

  const handleSubmitSupplier = async (data: CreateSupplierRequest) => {
    try {
      if (isEditing && editingSupplierId) {
        await update(editingSupplierId, data);
        showAlert(
          "Proveedor Actualizado",
          "dark",
          "success",
          "¡Proveedor actualizado exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Proveedor Creado",
          "dark",
          "success",
          "¡Proveedor creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitSupplier:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      showAlert(
        "Proveedor Eliminado",
        "dark",
        "success",
        "¡Proveedor eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar el proveedor."
      );
    }
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="h-8 w-8 text-orange-600" />
                Gestión de Proveedores
              </h1>
              <p className="text-gray-600 mt-2">
                Administra la red de proveedores de tu empresa
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nuevo Proveedor
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar proveedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                />
              </div>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Suppliers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Supplier Avatar */}
                  <div className="mb-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {supplier.name?.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Supplier Info */}
                  <div className="space-y-3 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {supplier.name}
                    </h3>
                    
                    {supplier.country && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <Building className="h-4 w-4" />
                        <span className="truncate">{supplier.country}</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {supplier.email && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{supplier.email}</span>
                        </div>
                      )}
                      
                      {supplier.phone && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      
                      {supplier.address && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{supplier.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        supplier.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {supplier.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      className="flex-1 btn btn-outline btn-sm border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors duration-200"
                      title="Editar proveedor"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => supplier.id && handleDeleteSupplier(supplier.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar proveedor"
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
              <Truck className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron proveedores" : "No hay proveedores"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza agregando tu primer proveedor"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Agregar Primer Proveedor
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
        content={
          <form onSubmit={handleSubmit(handleSubmitSupplier)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Proveedor
              </label>
              <input
                {...register("name", { 
                  required: "El nombre del proveedor es requerido",
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres"
                  }
                })}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="Nombre del proveedor"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País
              </label>
              <input
                {...register("country")}
                type="text"
                id="country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="País del proveedor"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email", { 
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="proveedor@empresa.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                placeholder="+1 234 567 8900"
              />
            </div>


            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <textarea
                {...register("address")}
                id="address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200 resize-none"
                placeholder="Dirección completa..."
              />
            </div>

            <div className="flex items-center">
              <input
                {...register("isActive")}
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Proveedor activo
              </label>
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
                className="btn btn-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Proveedor" : "Crear Proveedor"
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