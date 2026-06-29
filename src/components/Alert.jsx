const styles = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-gold-200 bg-gold-100/40 text-mocha-800"
};

const Alert = ({ type = "info", message }) =>
  message ? (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  ) : null;

export default Alert;

