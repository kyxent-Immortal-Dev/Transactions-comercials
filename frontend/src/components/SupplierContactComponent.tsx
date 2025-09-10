import { useState } from "react";
import { useSupplierContactService } from "../hooks/useSupplierContact.service";
import { useSupplierService } from "../hooks/useSupplier.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import { SupplierContact, CreateSupplierContactRequest, UpdateSupplierContactRequest } from "../interfaces/SupplierContact.interface";
import { Plus, Edit, Trash2, Users, Search, Filter, Phone, Mail, User } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const SupplierContactComponent = () => {
  const { supplierContacts, create, update, deleteSupplierContact, loading, getBySupplierId } = useSupplierContactService();
  const { suppliers } = useSupplierService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateSupplierContactRequest>({
    defaultValues: {
      supplier_id: 0,
      name: "",
      lastname: "",
      phone: "",
      email: "",
    },
  });

  const handleEditContact = (item: SupplierContact) => {
    setIsEditing(true);
    setEditingContactId(item.id || null);
    setValue("supplier_id", item.supplier_id);
    setValue("name", item.name || "");
    setValue("lastname", item.lastname || "");
    setValue("phone", item.phone || "");
    setValue("email", item.email || "");
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

  const handleSubmitContact = async (data: CreateSupplierContactRequest) => {
    try {
      if (isEditing && editingContactId) {
        await update(editingContactId, data);
        showAlert(
          "Contacto Actualizado",
          "dark",
          "success",
          "¡Contacto actualizado exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Contacto Creado",
          "dark",
          "success",
          "¡Contacto creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitContact:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteSupplierContact(id);
      showAlert(
        "Contacto Eliminado",
        "dark",
        "success",
        "¡Contacto eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar el contacto."
      );
    }
  };

  const handleSupplierFilter = async (supplierId: number | null) => {
    setSelectedSupplierId(supplierId);
    if (supplierId) {
      await getBySupplierId(supplierId);
    }
  };

  const filteredContacts = supplierContacts.filter(
    (contact) =>
      (selectedSupplierId === null || contact.supplier_id === selectedSupplierId) &&
      (contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                Contactos de Proveedores
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona los contactos asociados a cada proveedor
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nuevo Contacto
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar contactos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <select
                value={selectedSupplierId || ""}
                onChange={(e) => handleSupplierFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
              >
                <option value="">Todos los proveedores</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Contact Avatar */}
                  <div className="mb-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {contact.name?.charAt(0)}{contact.lastname?.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.name} {contact.lastname}
                    </h3>
                    
                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                      {contact.supplier?.name}
                    </div>
                    
                    <div className="space-y-2">
                      {contact.email && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                      
                      {contact.phone && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="flex-1 btn btn-outline btn-sm border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-colors duration-200"
                      title="Editar contacto"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => contact.id && handleDeleteContact(contact.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar contacto"
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
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm || selectedSupplierId ? "No se encontraron contactos" : "No hay contactos"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSupplierId
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Comienza agregando tu primer contacto"
              }
            </p>
            {!searchTerm && !selectedSupplierId && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Agregar Primer Contacto
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Contacto" : "Nuevo Contacto"}
        content={
          <form onSubmit={handleSubmit(handleSubmitContact)} className="space-y-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
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
                  placeholder="Nombre"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  {...register("lastname", { 
                    required: "El apellido es requerido",
                    minLength: {
                      value: 2,
                      message: "El apellido debe tener al menos 2 caracteres"
                    }
                  })}
                  type="text"
                  id="lastname"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                  placeholder="Apellido"
                />
                {errors.lastname && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastname.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register("email", { 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="contacto@empresa.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="+1 234 567 8900"
              />
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
                  isEditing ? "Actualizar Contacto" : "Crear Contacto"
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