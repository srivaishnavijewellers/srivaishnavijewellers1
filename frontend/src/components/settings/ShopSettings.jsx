import { useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../Alert.jsx";
import { saveSettings } from "../../services/settingsService.js";
import { getErrorMessage } from "../../utils/getErrorMessage.js";

const Field = ({ label, optional, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-mocha-800">
      {label}{" "}
      {optional && <span className="font-normal text-mocha-600">(Optional)</span>}
    </span>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-100";

const ShopSettings = ({ settings, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings.shopLogo || "");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      shopName: settings.shopName || "Sri Vaishnavi Jewellers",
      ownerName: settings.ownerName || "",
      shopAddress: settings.shopAddress || "",
      phone1: settings.phone1 || "",
      phone2: settings.phone2 || "",
      email: settings.email || "",
      gstNumber: settings.gstNumber || ""
    }
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setAlert(null);
    try {
      await saveSettings({ ...data, shopLogo: logoPreview });
      setAlert({ type: "success", message: "Shop information saved successfully." });
      onSaved?.();
    } catch (err) {
      setAlert({
        type: "error",
        message: getErrorMessage(err, "Unable to save shop information.")
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Shop Name">
          <input
            {...register("shopName", { required: "Shop name is required." })}
            className={inputCls}
          />
          {errors.shopName && (
            <p className="mt-1 text-sm text-red-600">{errors.shopName.message}</p>
          )}
        </Field>

        <Field label="Owner Name" optional>
          <input {...register("ownerName")} placeholder="Full name" className={inputCls} />
        </Field>

        <Field label="Phone Number 1" optional>
          <input {...register("phone1")} placeholder="+91 00000 00000" className={inputCls} />
        </Field>

        <Field label="Phone Number 2" optional>
          <input {...register("phone2")} placeholder="+91 00000 00000" className={inputCls} />
        </Field>

        <Field label="Email Address" optional>
          <input
            {...register("email")}
            type="email"
            placeholder="shop@example.com"
            className={inputCls}
          />
        </Field>

        <Field label="GST Number" optional>
          <input
            {...register("gstNumber")}
            placeholder="22AAAAA0000A1Z5"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Shop Address" optional>
        <textarea
          {...register("shopAddress")}
          rows={4}
          className={inputCls}
        />
      </Field>

      {/* Logo */}
      <div>
        <p className="mb-2 text-sm font-semibold text-mocha-800">Shop Logo</p>
        <div className="flex items-start gap-4">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Shop logo"
              className="h-20 w-20 rounded-2xl border border-[#ead7b4] bg-[#fffaf1] object-contain p-1"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-[#e6d7bf] bg-[#fffaf1] text-[10px] text-mocha-600">
              No Logo
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-2xl border border-[#ead7b4] px-4 py-2 text-sm font-semibold text-mocha-900 transition hover:bg-[#fffaf1]">
              {logoPreview ? "Replace Logo" : "Upload Logo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </label>
            {logoPreview && (
              <button
                type="button"
                onClick={() => setLogoPreview("")}
                className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Remove Logo
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-mocha-600">
          Logo will appear on bills, reports, and PDF exports.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-mocha-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-mocha-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Shop Information"}
        </button>
      </div>
    </form>
  );
};

export default ShopSettings;
