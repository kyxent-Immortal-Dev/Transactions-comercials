import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  Factory,
  RefreshCw,
  Save,
  Undo2,
  Sparkles
} from "lucide-react";
import { usePriceAnalysis } from "../hooks/usePriceAnalysis.service";
import { useRetaceoService } from "../hooks/useRetaceo.service";
import { ModalComponent } from "./ModalComponent";
import { useAlertsService } from "../hooks/useAlerts.service";
import type {
  PriceAnalysis,
  PriceAnalysisDetail,
  CreatePriceAnalysisRequest
} from "../interfaces/PriceAnalysis.interface";

type DetailEditState = {
  price: number;
  utility_percent: number;
};

type DetailRow = {
  detail: PriceAnalysisDetail;
  baseCost: number;
  currentPrice: number;
  priceValue: number;
  margin: number;
  quantity: number;
  grossProfit: number;
  totalRevenue: number;
};

export const PriceAnalysisComponent = () => {
  const {
    priceAnalyses,
    priceAnalysisDetails,
    createPriceAnalysis,
    createPriceAnalysisFromRetaceo,
    updatePriceAnalysis,
    deletePriceAnalysis,
    updatePriceAnalysisDetail,
    applyPriceAnalysis,
    getAllPriceAnalyses,
    getPriceAnalysisDetails,
    loading
  } = usePriceAnalysis();
  const { retaceos, loading: retaceoLoading } = useRetaceoService();
  const { showAlert } = useAlertsService();

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnalysisId, setEditingAnalysisId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRetaceoId, setSelectedRetaceoId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAnalysis, setSelectedAnalysis] = useState<PriceAnalysis | null>(null);
  const [detailEdits, setDetailEdits] = useState<Record<number, DetailEditState>>({});
  const [isRetaceoModalOpen, setIsRetaceoModalOpen] = useState(false);
  const [retaceoSearch, setRetaceoSearch] = useState("");
  const [retaceoToGenerate, setRetaceoToGenerate] = useState<number | null>(null);
  const [savingDetailId, setSavingDetailId] = useState<number | null>(null);
  const [applying, setApplying] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<CreatePriceAnalysisRequest>({
    defaultValues: {
      retaceo_id: 0,
      date: "",
      status: "pending"
    }
  });

  const formatDate = (value?: string | Date | null) => {
    if (!value) return "N/A";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const toTwoDecimals = (value: number) => (Number.isFinite(value) ? Number(value.toFixed(2)) : 0);

  const handleEditAnalysis = (item: PriceAnalysis) => {
    setIsEditing(true);
    setEditingAnalysisId(item.id ?? null);
    setValue("retaceo_id", item.retaceo_id);
    setValue("date", item.date ? new Date(item.date).toISOString().split("T")[0] : "");
    setValue("status", item.status || "pending");
    setOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(false);
    reset();
    setValue("date", new Date().toISOString().split("T")[0]);
    setValue("status", "pending");
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsEditing(false);
    reset();
  };

  const handleSubmitAnalysis = async (data: CreatePriceAnalysisRequest) => {
    try {
      const payload = {
        ...data,
        retaceo_id: Number(data.retaceo_id)
      };

      if (isEditing && editingAnalysisId) {
        const updated = await updatePriceAnalysis(editingAnalysisId, payload);
        showAlert("Análisis Actualizado", "dark", "success", "¡Análisis de precio actualizado exitosamente!");
        if (updated) {
          await getAllPriceAnalyses();
          await handleSelectAnalysis(updated);
        }
      } else {
        const created = await createPriceAnalysis(payload);
        showAlert("Análisis Creado", "dark", "success", "¡Análisis de precio creado exitosamente!");
        if (created) {
          await getAllPriceAnalyses();
          await handleSelectAnalysis(created);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error in handleSubmitAnalysis:", error);
      showAlert("Error", "dark", "error", "Ha ocurrido un error. Por favor, intenta de nuevo.");
    }
  };

  const handleDeleteAnalysis = async (id: number) => {
    try {
      await deletePriceAnalysis(id);
      showAlert("Análisis Eliminado", "dark", "success", "¡Análisis de precio eliminado exitosamente!");
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
      await getAllPriceAnalyses();
    } catch (error) {
      console.error("Error deleting analysis:", error);
      showAlert("Error", "dark", "error", "Error al eliminar el análisis");
    }
  };

  const handleRetaceoFilterChange = (retaceoId: number) => {
    setSelectedRetaceoId(retaceoId === 0 ? null : retaceoId);
  };

  const handleSelectAnalysis = useCallback(
    async (analysis: PriceAnalysis) => {
      setSelectedAnalysis(analysis);
      if (analysis.id) {
        try {
          await getPriceAnalysisDetails(analysis.id);
        } catch (error) {
          console.error("Error getting price analysis details:", error);
        }
      }
    },
    [getPriceAnalysisDetails]
  );

  useEffect(() => {
    if (!priceAnalyses.length) {
      setSelectedAnalysis(null);
      return;
    }

    if (!selectedAnalysis) {
      void handleSelectAnalysis(priceAnalyses[0]);
      return;
    }

    const exists = priceAnalyses.some((analysis) => analysis.id === selectedAnalysis.id);
    if (!exists) {
      void handleSelectAnalysis(priceAnalyses[0]);
    }
  }, [priceAnalyses, selectedAnalysis, handleSelectAnalysis]);

  useEffect(() => {
    if (!priceAnalysisDetails.length) {
      setDetailEdits({});
      return;
    }

    const nextState: Record<number, DetailEditState> = {};
    priceAnalysisDetails.forEach((detail) => {
      const baseCost = detail.product?.final_bill_retaceo ?? detail.product?.bill_cost ?? 0;
      const fallbackPrice = detail.price ?? detail.product?.price ?? baseCost;
      const safePrice = Number.isFinite(fallbackPrice ?? 0) ? Number(fallbackPrice) : 0;
      const computedMargin =
        baseCost > 0 ? ((safePrice - baseCost) / baseCost) * 100 : detail.utility_percent ?? 0;
      nextState[detail.id] = {
        price: toTwoDecimals(safePrice),
        utility_percent: toTwoDecimals(detail.utility_percent ?? computedMargin ?? 0)
      };
    });

    setDetailEdits(nextState);
  }, [priceAnalysisDetails]);

  const filteredAnalyses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return priceAnalyses.filter((analysis) => {
      const code = analysis.code?.toLowerCase() ?? "";
      const retaceoCode = analysis.retaceo?.code?.toLowerCase() ?? "";
      const supplierName = analysis.retaceo?.purchase?.supplier?.name?.toLowerCase() ?? "";

      const matchesSearch =
        !search || code.includes(search) || retaceoCode.includes(search) || supplierName.includes(search);

      const matchesRetaceo = selectedRetaceoId === null || analysis.retaceo_id === selectedRetaceoId;
      const matchesStatus = !selectedStatus || (analysis.status || "pending") === selectedStatus;

      return matchesSearch && matchesRetaceo && matchesStatus;
    });
  }, [priceAnalyses, searchTerm, selectedRetaceoId, selectedStatus]);

  const stats = useMemo(() => {
    const total = priceAnalyses.length;
    const pending = priceAnalyses.filter((item) => (item.status || "pending") === "pending").length;
    const approved = priceAnalyses.filter((item) => (item.status || "") === "approved").length;
    const suppliers = new Set(
      priceAnalyses
        .map((analysis) => analysis.retaceo?.purchase?.supplier?.name)
        .filter((name): name is string => Boolean(name))
    ).size;

    return { total, pending, approved, suppliers };
  }, [priceAnalyses]);

  const eligibleRetaceos = useMemo(
    () => retaceos.filter((retaceo) => (retaceo.status || "").toLowerCase() === "approved"),
    [retaceos]
  );

  const filteredRetaceos = useMemo(() => {
    const search = retaceoSearch.trim().toLowerCase();
    if (!search) return eligibleRetaceos;

    return eligibleRetaceos.filter((retaceo) => {
      const code = retaceo.code?.toLowerCase() ?? "";
      const invoice = retaceo.num_invoice?.toLowerCase() ?? "";
      const supplier = retaceo.purchase?.supplier?.name?.toLowerCase() ?? "";

      return code.includes(search) || invoice.includes(search) || supplier.includes(search);
    });
  }, [eligibleRetaceos, retaceoSearch]);

  const detailRows: DetailRow[] = useMemo(() => {
    if (!priceAnalysisDetails.length) return [];

    return priceAnalysisDetails.map((detail) => {
      const baseCost = detail.product?.final_bill_retaceo ?? detail.product?.bill_cost ?? 0;
      const currentPrice = detail.product?.price ?? 0;
      const quantity = detail.quantity ?? 0;

      const edit = detailEdits[detail.id];
      const rawPrice = edit?.price ?? detail.price ?? currentPrice ?? baseCost;
      const safePrice = Number.isFinite(rawPrice) ? Number(rawPrice) : 0;

      const rawMargin =
        edit?.utility_percent ??
        detail.utility_percent ??
        (baseCost > 0 ? ((safePrice - baseCost) / baseCost) * 100 : 0);
      const safeMargin = Number.isFinite(rawMargin) ? Number(rawMargin) : 0;

      const grossProfit = safePrice - baseCost;
      const totalRevenue = safePrice * quantity;

      return {
        detail,
        baseCost: toTwoDecimals(baseCost),
        currentPrice: toTwoDecimals(currentPrice),
        priceValue: toTwoDecimals(safePrice),
        margin: toTwoDecimals(safeMargin),
        quantity,
        grossProfit: toTwoDecimals(grossProfit),
        totalRevenue: toTwoDecimals(totalRevenue)
      };
    });
  }, [priceAnalysisDetails, detailEdits]);

  const detailSummary = useMemo(() => {
    if (!detailRows.length) {
      return {
        totalProducts: 0,
        projectedRevenue: 0,
        projectedCost: 0,
        projectedProfit: 0,
        averageMargin: 0
      };
    }

    const projectedRevenue = detailRows.reduce((acc, row) => acc + row.totalRevenue, 0);
    const projectedCost = detailRows.reduce((acc, row) => acc + row.baseCost * row.quantity, 0);
    const projectedProfit = projectedRevenue - projectedCost;
    const averageMargin = detailRows.reduce((acc, row) => acc + row.margin, 0) / detailRows.length;

    return {
      totalProducts: detailRows.length,
      projectedRevenue: toTwoDecimals(projectedRevenue),
      projectedCost: toTwoDecimals(projectedCost),
      projectedProfit: toTwoDecimals(projectedProfit),
      averageMargin: toTwoDecimals(averageMargin)
    };
  }, [detailRows]);

  const handlePriceInputChange = (row: DetailRow, value: string) => {
    const price = Number.parseFloat(value);
    if (Number.isNaN(price)) return;

    const margin = row.baseCost > 0 ? ((price - row.baseCost) / row.baseCost) * 100 : 0;

    setDetailEdits((prev) => ({
      ...prev,
      [row.detail.id]: {
        price: toTwoDecimals(price),
        utility_percent: toTwoDecimals(margin)
      }
    }));
  };

  const handleMarginInputChange = (row: DetailRow, value: string) => {
    const margin = Number.parseFloat(value);
    if (Number.isNaN(margin)) return;

    const price = row.baseCost * (1 + margin / 100);

    setDetailEdits((prev) => ({
      ...prev,
      [row.detail.id]: {
        price: toTwoDecimals(price),
        utility_percent: toTwoDecimals(margin)
      }
    }));
  };

  const handleResetDetail = (row: DetailRow) => {
    const baseCost = row.baseCost;
    const originalPrice = row.detail.price ?? row.currentPrice ?? baseCost;
    const margin =
      row.detail.utility_percent ??
      (baseCost > 0 ? ((originalPrice - baseCost) / baseCost) * 100 : 0);

    setDetailEdits((prev) => ({
      ...prev,
      [row.detail.id]: {
        price: toTwoDecimals(originalPrice),
        utility_percent: toTwoDecimals(margin)
      }
    }));
  };

  const handleSaveDetail = async (row: DetailRow) => {
    const edit = detailEdits[row.detail.id];
    if (!edit) return;

    try {
      setSavingDetailId(row.detail.id);
      await updatePriceAnalysisDetail(row.detail.id, {
        price: Number(edit.price),
        utility_percent: Number(edit.utility_percent),
        quantity: row.detail.quantity
      });
      showAlert("Detalle actualizado", "dark", "success", "Se guardaron los cambios del producto.");
      if (row.detail.price_analysis_id) {
        await getPriceAnalysisDetails(row.detail.price_analysis_id);
      }
    } catch (error) {
      console.error("Error updating detail:", error);
      showAlert("Error", "dark", "error", "No se pudo actualizar el detalle.");
    } finally {
      setSavingDetailId(null);
    }
  };

  const handleGenerateFromRetaceo = async () => {
    if (!retaceoToGenerate) return;

    try {
      const analysis = await createPriceAnalysisFromRetaceo(retaceoToGenerate);
      showAlert("Análisis generado", "dark", "success", "Se creó el análisis desde el retaceo seleccionado.");
      setIsRetaceoModalOpen(false);
      setRetaceoToGenerate(null);
      await getAllPriceAnalyses();
      await handleSelectAnalysis(analysis);
    } catch (error) {
      console.error("Error generating analysis from retaceo:", error);
      showAlert("Error", "dark", "error", "No fue posible generar el análisis desde el retaceo.");
    }
  };

  const handleApplyAnalysis = async () => {
    if (!selectedAnalysis?.id) return;

    try {
      setApplying(true);
      const response = await applyPriceAnalysis(selectedAnalysis.id);
      showAlert(
        "Análisis aplicado",
        "dark",
        "success",
        `Se actualizaron ${response.updatedProducts.length} productos con los nuevos precios.`
      );
      await getAllPriceAnalyses();
      await handleSelectAnalysis(response.analysis);
    } catch (error) {
      console.error("Error applying analysis:", error);
      showAlert("Error", "dark", "error", "No fue posible aplicar el análisis de precios.");
    } finally {
      setApplying(false);
    }
  };

  const isApplyDisabled =
    applying ||
    loading ||
    !selectedAnalysis ||
    (selectedAnalysis.status || "pending") === "approved" ||
    detailRows.length === 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <TrendingUp className="text-purple-600" size={40} />
            Análisis de Precios
          </h1>
          <p className="text-gray-600 mt-1">
            Evalúa costos, márgenes y precios de venta generados a partir de tus retaceos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsRetaceoModalOpen(true)}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-5 py-3 rounded-lg shadow transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Sparkles size={18} />
            Generar desde retaceo
          </button>
          <button
            onClick={handleCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Nuevo análisis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow px-5 py-4 flex items-center gap-3">
          <BarChart3 className="text-purple-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Analizados</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-4 flex items-center gap-3">
          <RefreshCw className="text-yellow-500" size={28} />
          <div>
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Aprobados</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-4 flex items-center gap-3">
          <Factory className="text-indigo-500" size={28} />
          <div>
            <p className="text-sm text-gray-500">Proveedores</p>
            <p className="text-2xl font-semibold text-gray-800">{stats.suppliers}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por código, retaceo o proveedor..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedRetaceoId || 0}
            onChange={(event) => handleRetaceoFilterChange(Number(event.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={0}>Todos los retaceos</option>
            {retaceos.map((retaceo) => (
              <option key={retaceo.id} value={retaceo.id ?? 0}>
                {retaceo.code ?? `RET-${retaceo.id}`} · {retaceo.purchase?.supplier?.name ?? "Proveedor desconocido"}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-sm text-gray-500">
              {filteredAnalyses.length} {filteredAnalyses.length === 1 ? "resultado" : "resultados"}
            </span>
            <button
              onClick={() => void getAllPriceAnalyses()}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} />
              Refrescar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Código</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Retaceo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Proveedor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Cargando análisis de precios...
                  </td>
                </tr>
              ) : filteredAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron análisis con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredAnalyses.map((analysis) => {
                  const status = analysis.status || "pending";
                  const isSelected = selectedAnalysis?.id === analysis.id;

                  return (
                    <tr
                      key={analysis.id}
                      onClick={() => void handleSelectAnalysis(analysis)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? "bg-purple-50" : "hover:bg-purple-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {analysis.code ?? `ANL-${analysis.id}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {analysis.retaceo?.code ?? "Sin código"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {analysis.retaceo?.purchase?.supplier?.name ?? "Proveedor no definido"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(analysis.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            status === "approved"
                              ? "bg-green-100 text-green-800"
                              : status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {status === "approved" && <CheckCircle size={14} className="inline mr-1" />}
                          {status === "rejected" && <XCircle size={14} className="inline mr-1" />}
                          {status === "approved"
                            ? "Aprobado"
                            : status === "rejected"
                            ? "Rechazado"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleEditAnalysis(analysis);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteAnalysis(analysis.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {selectedAnalysis ? (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  {selectedAnalysis.code ?? `Análisis #${selectedAnalysis.id}`}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      (selectedAnalysis.status || "pending") === "approved"
                        ? "bg-green-100 text-green-700"
                        : (selectedAnalysis.status || "pending") === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {(selectedAnalysis.status || "pending") === "approved"
                      ? "Aprobado"
                      : (selectedAnalysis.status || "pending") === "rejected"
                      ? "Rechazado"
                      : "Pendiente"}
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  Retaceo: {selectedAnalysis.retaceo?.code ?? "No asignado"} · Factura: {selectedAnalysis.num_invoice ?? "Sin factura"} · Fecha: {formatDate(selectedAnalysis.date)}
                </p>
              </div>
              <button
                onClick={handleApplyAnalysis}
                disabled={isApplyDisabled}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-colors ${
                  isApplyDisabled
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {applying ? <RefreshCw size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {applying ? "Aplicando..." : "Aplicar análisis"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 uppercase">Productos analizados</p>
                <p className="text-xl font-semibold text-gray-800">{detailSummary.totalProducts}</p>
              </div>
              <div className="border rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 uppercase">Ingresos proyectados</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(detailSummary.projectedRevenue)}
                </p>
              </div>
              <div className="border rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 uppercase">Costo total</p>
                <p className="text-xl font-semibold text-gray-800">
                  {formatCurrency(detailSummary.projectedCost)}
                </p>
              </div>
              <div className="border rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 uppercase">Margen promedio</p>
                <p className="text-xl font-semibold text-gray-800">{detailSummary.averageMargin}%</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 uppercase text-xs tracking-wide">
                    <th className="pb-3">Producto</th>
                    <th className="pb-3 text-right">Costo base</th>
                    <th className="pb-3 text-right">Precio actual</th>
                    <th className="pb-3 text-right">Nuevo precio</th>
                    <th className="pb-3 text-right">Margen %</th>
                    <th className="pb-3 text-right">Cantidad</th>
                    <th className="pb-3 text-right">Diferencia</th>
                    <th className="pb-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-gray-500">
                        No hay detalles asociados al análisis seleccionado.
                      </td>
                    </tr>
                  ) : (
                    detailRows.map((row) => {
                      const priceDiff = row.priceValue - row.currentPrice;

                      return (
                        <tr key={row.detail.id} className="hover:bg-gray-50">
                          <td className="py-4 pr-4">
                            <div className="font-medium text-gray-800">
                              {row.detail.product?.name ?? `Producto ${row.detail.product_id}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              Código: {row.detail.product?.code ?? "Sin código"}
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-right text-gray-700">
                            {formatCurrency(row.baseCost)}
                          </td>
                          <td className="py-4 pr-4 text-right text-gray-700">
                            {formatCurrency(row.currentPrice)}
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={detailEdits[row.detail.id]?.price ?? row.priceValue}
                              onChange={(event) => handlePriceInputChange(row, event.target.value)}
                              className="w-28 border border-gray-300 rounded-lg px-2 py-1 text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <input
                              type="number"
                              step="0.1"
                              value={detailEdits[row.detail.id]?.utility_percent ?? row.margin}
                              onChange={(event) => handleMarginInputChange(row, event.target.value)}
                              className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-right focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </td>
                          <td className="py-4 pr-4 text-right text-gray-700">{row.quantity}</td>
                          <td className={`py-4 pr-4 text-right font-semibold ${priceDiff >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(priceDiff)}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleResetDetail(row)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Revertir cambios"
                                disabled={savingDetailId === row.detail.id || loading}
                              >
                                <Undo2 size={16} />
                              </button>
                              <button
                                onClick={() => void handleSaveDetail(row)}
                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Guardar cambios"
                                disabled={savingDetailId === row.detail.id || loading}
                              >
                                {savingDetailId === row.detail.id ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <Save size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-16">
            Selecciona un análisis para revisar sus detalles, ajustar márgenes y confirmar los nuevos precios.
          </div>
        )}
      </div>

      <ModalComponent
        open={open}
        onClose={handleCloseModal}
        title={isEditing ? "Editar análisis de precio" : "Nuevo análisis de precio"}
        content={
          <form onSubmit={handleSubmit(handleSubmitAnalysis)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Retaceo *</label>
              <select
                {...register("retaceo_id", {
                  required: "El retaceo es obligatorio",
                  validate: (value) => value > 0 || "Debe seleccionar un retaceo válido"
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={0}>Seleccionar retaceo</option>
                {retaceos.map((retaceo) => (
                  <option key={retaceo.id} value={retaceo.id ?? 0}>
                    {retaceo.code ?? `RET-${retaceo.id}`} · {retaceo.purchase?.supplier?.name ?? "Proveedor desconocido"}
                  </option>
                ))}
              </select>
              {errors.retaceo_id && (
                <p className="mt-1 text-sm text-red-600">{errors.retaceo_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
              <input
                type="date"
                {...register("date", { required: "La fecha es obligatoria" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado *</label>
              <select
                {...register("status", { required: "El estado es obligatorio" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="rejected">Rechazado</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
            </div>

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
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        }
      />

      <ModalComponent
        open={isRetaceoModalOpen}
        onClose={() => {
          setIsRetaceoModalOpen(false);
          setRetaceoToGenerate(null);
          setRetaceoSearch("");
        }}
        title="Generar análisis desde retaceo"
        content={
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar retaceo por código, proveedor o factura..."
                value={retaceoSearch}
                onChange={(event) => setRetaceoSearch(event.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {retaceoLoading ? (
                <div className="py-6 text-center text-gray-500">Cargando retaceos aprobados...</div>
              ) : filteredRetaceos.length === 0 ? (
                <div className="py-6 text-center text-gray-500">No hay retaceos aprobados disponibles.</div>
              ) : (
                filteredRetaceos.map((retaceo) => (
                  <label
                    key={retaceo.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-purple-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="mt-1"
                      checked={retaceoToGenerate === retaceo.id}
                      onChange={() => setRetaceoToGenerate(retaceo.id ?? null)}
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {retaceo.code ?? `Retaceo #${retaceo.id}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        Proveedor: {retaceo.purchase?.supplier?.name ?? "No definido"} · Factura: {retaceo.num_invoice ?? "Sin factura"} · Fecha: {formatDate(retaceo.date)}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRetaceoModalOpen(false);
                  setRetaceoToGenerate(null);
                  setRetaceoSearch("");
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!retaceoToGenerate || loading}
                onClick={() => void handleGenerateFromRetaceo()}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Generando..." : "Generar análisis"}
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
