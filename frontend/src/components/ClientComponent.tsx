import { useState } from "react";
import { useClientService } from "../hooks/useClient.service";
import { ModalComponent } from "./ModalComponent";
import { useForm } from "react-hook-form";
import { Client, CreateClientRequest, UpdateClientRequest } from "../interfaces/Client.interface";
import { Plus, Edit, Trash2, UserCheck, Search, Filter, Phone, Mail, MapPin, Building } from "lucide-react";
import { useAlertsService } from "../hooks/useAlerts.service";

export const ClientComponent = () => {
  const { clients, create, update, deleteClient, loading } = useClientService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateClientRequest>({
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      isActive: true,
    },
  });

  const handleEditClient = (item: Client) => {
    setIsEditing(true);
    setValue("name", item.name || "");
    setValue("lastname", item.lastname || "");
    setValue("email", item.email || "");
    setValue("phone", item.phone || "");
    setValue("address", item.address || "");
    setValue("company", item.company || "");
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

  const handleSubmitClient = async (data: CreateClientRequest) => {
    try {
      if (isEditing && editingClientId) {
        await update(editingClientId, data);
        showAlert(
          "Cliente Actualizado",
          "dark",
          "success",
          "¡Cliente actualizado exitosamente!"
        );
      } else {
        await create(data);
        showAlert(
          "Cliente Creado",
          "dark",
          "success",
          "¡Cliente creado exitosamente!"
        );
      }
      reset();
      handleCloseModal();
    } catch (error) {
      console.error('Error in handleSubmitClient:', error);
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id);
      showAlert(
        "Cliente Eliminado",
        "dark",
        "success",
        "¡Cliente eliminado exitosamente!"
      );
    } catch {
      showAlert(
        "Error",
        "dark",
        "error",
        "Ha ocurrido un error al eliminar el cliente."
      );
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UserCheck className="h-8 w-8 text-purple-600" />
                Gestión de Clientes
              </h1>
              <p className="text-gray-600 mt-2">
                Administra la base de datos de clientes de tu empresa
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Nuevo Cliente
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                />
              </div>
              <button className="btn text-black btn-outline border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  {/* Client Avatar */}
                  <div className="mb-4">
                    <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white text-xl font-bold">
                        {client.name?.charAt(0)}{client.lastname?.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-3 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.name} {client.lastname}
                    </h3>
                    
                    {client.company && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                        <Building className="h-4 w-4" />
                        <span className="truncate">{client.company}</span>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {client.email && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      
                      {client.phone && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <Phone className="h-4 w-4" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                      
                      {client.address && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{client.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        client.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {client.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEditClient(client)}
                      className="flex-1 btn btn-outline btn-sm border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-colors duration-200"
                      title="Editar cliente"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => client.id && handleDeleteClient(client.id)}
                      className="flex-1 btn btn-outline btn-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      title="Eliminar cliente"
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
              <UserCheck className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda"
                : "Comienza agregando tu primer cliente"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreateNew}
                className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                Agregar Primer Cliente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit */}
      <ModalComponent
        title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        content={
          <form onSubmit={handleSubmit(handleSubmitClient)} className="space-y-6">
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
                  required: "El email es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                })}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="cliente@empresa.com"
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

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                {...register("company")}
                type="text"
                id="company"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                placeholder="Nombre de la empresa"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                placeholder="Dirección completa..."
              />
            </div>

            <div className="flex items-center">
              <input
                {...register("isActive")}
                type="checkbox"
                id="isActive"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Cliente activo
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
                className="btn btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isEditing ? "Actualizando..." : "Creando..."}
                  </div>
                ) : (
                  isEditing ? "Actualizar Cliente" : "Crear Cliente"
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