const DeleteConfirmationModal = ({
  open,
  itemName,
  loading,
  onCancel,
  onConfirm
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="font-display text-2xl text-mocha-900">Delete Stock Item</h3>
        <p className="mt-3 text-sm text-mocha-700">
          Are you sure you want to delete {itemName ? `"${itemName}"` : "this stock item"}?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[#ead7b4] px-4 py-3 text-sm font-semibold text-mocha-900"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-2xl bg-[#8b1e1e] px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

