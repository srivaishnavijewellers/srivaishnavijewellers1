const statusTone = {
  Online: "bg-[#ddf6df] text-[#2e7d32]",
  Connected: "bg-[#ddf6df] text-[#2e7d32]",
  Connecting: "bg-[#fff2cf] text-[#a86e08]",
  Disconnected: "bg-[#ffe1e1] text-[#b43333]",
  Disconnecting: "bg-[#fff2cf] text-[#a86e08]",
  Unknown: "bg-[#f0e5d2] text-mocha-700"
};

const formatDateTime = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const StatusRow = ({ label, value, tone }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#fffaf1] px-4 py-3">
    <span className="text-sm text-mocha-700">{label}</span>
    <span className={tone ? `rounded-full px-3 py-1 text-xs font-semibold ${tone}` : "text-sm font-semibold text-mocha-900"}>
      {value}
    </span>
  </div>
);

const SystemStatusCard = ({ loading, status }) => (
  <aside className="rounded-3xl border border-[#ead7b4] bg-white p-5 shadow-sm">
    <h2 className="font-display text-2xl text-mocha-900">System Status</h2>
    <p className="mt-1 text-sm text-mocha-700">
      Backend, database, and logged-in user information.
    </p>

    <div className="mt-6 space-y-3">
      {loading ? (
        [1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="h-12 animate-pulse rounded-2xl bg-[#faf3e6]" />
        ))
      ) : (
        <>
          <StatusRow
            label="Backend Status"
            value={status?.backendStatus || "Unknown"}
            tone={statusTone[status?.backendStatus || "Unknown"]}
          />
          <StatusRow
            label="MongoDB Status"
            value={status?.mongoStatus || "Unknown"}
            tone={statusTone[status?.mongoStatus || "Unknown"]}
          />
          <StatusRow label="Logged-in User" value={status?.user?.name || "Authorized User"} />
          <StatusRow label="Role" value={status?.user?.role || "STAFF"} />
          <StatusRow
            label="Last Login Time"
            value={formatDateTime(status?.user?.lastLogin)}
          />
        </>
      )}
    </div>
  </aside>
);

export default SystemStatusCard;

