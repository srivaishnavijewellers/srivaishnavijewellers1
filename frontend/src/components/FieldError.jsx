const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;

export default FieldError;

