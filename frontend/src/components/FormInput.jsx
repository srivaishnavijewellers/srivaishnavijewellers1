import FieldError from "./FieldError.jsx";

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  rightElement,
  autoComplete
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-mocha-800">{label}</span>
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, rules)}
        className="w-full rounded-2xl border border-[#e6d7bf] bg-[#fffdfa] px-4 py-3 text-sm text-mocha-900 outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
      />
      {rightElement ? (
        <div className="absolute inset-y-0 right-3 flex items-center">
          {rightElement}
        </div>
      ) : null}
    </div>
    <FieldError message={error?.message} />
  </label>
);

export default FormInput;
