import { FiEye } from "react-icons/fi";

const statusClasses = {
  Issued: "bg-[#fff2cf] text-[#a86e08]",
  Overdue: "bg-[#ffe1e1] text-[#b43333]",
  Returned: "bg-[#ddf6df] text-[#2e7d32]"
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

const InfoLine = ({ label, value }) => (
  <p className="text-sm text-mocha-700">
    <span className="font-semibold text-mocha-900">{label} :</span> {value || "-"}
  </p>
);

const IssuedCard = ({ item }) => (
  <article className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm transition hover:border-gold-500">
    <div className="grid gap-5 xl:grid-cols-3">
      <div className="space-y-2">
        <InfoLine label="Item No" value={item.itemNumber} />
        <h3 className="font-display text-2xl text-mocha-900">{item.itemName}</h3>
        <InfoLine label="Category" value={item.category} />
      </div>

      <div className="space-y-2">
        {item.weight !== undefined && <InfoLine label="Weight" value={`${item.weight} g`} />}
        {item.purity && <InfoLine label="Purity" value={item.purity} />}
        {item.count !== undefined && <InfoLine label="Pieces" value={item.count} />}
        {item.barcode && <InfoLine label="Barcode" value={item.barcode} />}
      </div>

      <div className="space-y-2">
        {item.issueDate && <InfoLine label="Issued Date" value={formatDate(item.issueDate)} />}
        {item.issuedTo && <InfoLine label="Issued To" value={item.issuedTo} />}
        {item.transactionNumber && <InfoLine label="Transaction" value={item.transactionNumber} />}
        
        <div className="text-sm text-mocha-700">
          <span className="font-semibold text-mocha-900">Status :</span>{" "}
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              statusClasses[item.status] || "bg-[#f0e5d2] text-mocha-700"
            }`}
          >
            {item.status || "Issued"}
          </span>
        </div>
      </div>
    </div>
  </article>
);

export default IssuedCard;
