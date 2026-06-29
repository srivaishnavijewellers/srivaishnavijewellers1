import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiPrinter, FiSave } from "react-icons/fi";
import Alert from "../components/Alert.jsx";
import LabelPreview from "../components/LabelPreview.jsx";
import { printStockLabel } from "../components/PrintLabel.jsx";
import StockForm from "../components/StockForm.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import { getProfile, logoutRequest } from "../services/authService.js";
import {
  createStock,
  generateBarcode,
  generateItemNumber,
  getStockById,
  updateStock
} from "../services/stockService.js";
import { clearSession, getStoredSession, isSessionExpired } from "../utils/authStorage.js";
import { getErrorMessage } from "../utils/getErrorMessage.js";

const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    isEditMode: params.get("mode") === "edit",
    editId: params.get("id") || null
  };
};

const AddStock = () => {
  const session = getStoredSession();
  const { isEditMode, editId } = getUrlParams();

  const [user, setUser] = useState(session?.user || null);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [generatingItemNumber, setGeneratingItemNumber] = useState(false);
  const [generatingBarcode, setGeneratingBarcode] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      itemNumber: "",
      itemName: "",
      category: "",
      grossWeight: "",
      netWeight: "",
      supplier: "",
      purity: "",
      count: 1,
      barcode: "",
      description: ""
    }
  });

  const grossWeightValue = watch("grossWeight");

  // Auto-fill net weight from gross weight
  useEffect(() => {
    if (grossWeightValue) {
      setValue("netWeight", grossWeightValue);
    }
  }, [grossWeightValue]);

  const watchedValues = {
    itemNumber: watch("itemNumber"),
    itemName: watch("itemName"),
    grossWeight: watch("grossWeight"),
    purity: watch("purity"),
    barcode: watch("barcode")
  };

  useEffect(() => {
    if (!session || isSessionExpired(session)) {
      clearSession();
      window.location.replace("/login");
      return;
    }

    const timeout = window.setTimeout(() => {
      clearSession();
      window.location.replace("/login");
    }, Math.max(0, session.expiresAt - Date.now()));

    const init = async () => {
      try {
        const profileData = await getProfile();
        setUser(profileData.user);

        if (isEditMode && editId) {
          const response = await getStockById(editId);
          const stock = response.item;
          reset({
            itemNumber: stock.itemNumber || "",
            itemName: stock.itemName || "",
            category: stock.category || "",
            grossWeight: stock.grossWeight ?? stock.weight ?? "",
            netWeight: stock.netWeight ?? stock.grossWeight ?? stock.weight ?? "",
            supplier: stock.supplier || "",
            purity: stock.purity || "",
            count: stock.count ?? 1,
            barcode: stock.barcode || "",
            description: stock.description || ""
          });
        } else {
          await fetchItemNumber();
        }
      } catch (error) {
        setAlert({
          type: "error",
          message: getErrorMessage(error, "Unable to load page. Please try again.")
        });
      }
    };

    init();
    return () => window.clearTimeout(timeout);
  }, []);

  const fetchItemNumber = async () => {
    setGeneratingItemNumber(true);
    try {
      const data = await generateItemNumber();
      setValue("itemNumber", data.itemNumber);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to generate item number.")
      });
    } finally {
      setGeneratingItemNumber(false);
    }
  };

  const handleGenerateBarcode = async () => {
    const itemNumber = watch("itemNumber");
    if (!itemNumber) return;

    setGeneratingBarcode(true);
    try {
      const data = await generateBarcode({ itemNumber });
      setValue("barcode", data.barcode);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to generate barcode.")
      });
    } finally {
      setGeneratingBarcode(false);
    }
  };

  const handlePrint = async () => {
    const values = watch();
    setPrinting(true);
    try {
      await printStockLabel({
        itemNumber: values.itemNumber,
        barcode: values.barcode || values.itemNumber,
        itemName: values.itemName,
        grossWeight: values.grossWeight,
        purity: values.purity
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(
          error,
          "Unable to open print window. Please allow popups and try again."
        )
      });
    } finally {
      setPrinting(false);
    }
  };

  const onSubmit = async (formData) => {
    setSaving(true);
    setAlert(null);

    const payload = {
      ...formData,
      createdBy: user?.name || "Authorized User",
      addedBy: user?.name || "Authorized User",
      status: "Available"
    };

    try {
      if (isEditMode && editId) {
        await updateStock(editId, payload);
        setAlert({ type: "success", message: "Stock item updated successfully. Redirecting..." });
      } else {
        await createStock(payload);
        setAlert({ type: "success", message: "Stock item saved successfully. Redirecting..." });
      }
      window.setTimeout(() => window.location.assign("/stock-management"), 1200);
    } catch (error) {
      setAlert({
        type: "error",
        message: getErrorMessage(error, "Unable to save stock item. Please try again.")
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearSession();
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? "Edit Stock" : "Add Stock"}
      subtitle={
        isEditMode ? "Update Jewellery Stock Item" : "Create a New Jewellery Stock Item"
      }
      user={user}
      onLogout={handleLogout}
      activeMenu="add-stock"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-4 rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl text-mocha-900">
              {isEditMode ? "Edit Stock" : "Add Stock"}
            </h2>
            <p className="mt-1 text-sm text-mocha-700">
              {isEditMode
                ? "Update the details for this jewellery stock item."
                : "Create a new jewellery stock item for inventory."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.assign("/stock-management")}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-4 py-3 text-sm font-semibold text-mocha-900"
          >
            <FiArrowLeft size={16} />
            Back
          </button>
        </div>

        {alert ? (
          <div className="mt-6">
            <Alert type={alert.type} message={alert.message} />
          </div>
        ) : null}

        <div className="mt-6">
          <StockForm
            register={register}
            errors={errors}
            user={user}
            watch={watch}
            isEditMode={isEditMode}
            generatingItemNumber={generatingItemNumber}
            generatingBarcode={generatingBarcode}
            onGenerateItemNumber={fetchItemNumber}
            onGenerateBarcode={handleGenerateBarcode}
          />
        </div>

        <div className="mt-6">
          <LabelPreview values={watchedValues} />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handlePrint}
            disabled={printing}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#ead7b4] px-5 py-3 text-sm font-semibold text-mocha-900 disabled:opacity-50"
          >
            <FiPrinter size={16} />
            {printing ? "Opening Print..." : "Print Barcode Label"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <FiSave size={16} />
            {saving ? "Saving..." : isEditMode ? "Update Stock" : "Save Stock"}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddStock;
