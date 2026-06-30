const Row = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-[#ead7b4] py-3 last:border-0">
    <span className="text-sm text-mocha-700">{label}</span>
    <span className="text-sm font-semibold text-mocha-900">{value}</span>
  </div>
);

const AboutSettings = () => (
  <div className="space-y-6">
    <div className="flex items-start gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e3ae]">
        <span className="font-display text-xl text-[#8f6720]">SV</span>
      </div>
      <div>
        <h4 className="font-display text-2xl text-mocha-900">Sri Vaishnavi Jewellers</h4>
        <p className="text-sm text-mocha-700">Stock Management Portal</p>
      </div>
    </div>

    <div className="rounded-2xl border border-[#ead7b4] px-4">
      <Row label="Application Name" value="Sri Vaishnavi Jewellers — Stock Management Portal" />
      <Row label="Version"          value="1.0.0" />
      <Row label="Frontend"         value="React.js (Vite)" />
      <Row label="Backend"          value="Node.js + Express.js" />
      <Row label="Database"         value="MongoDB" />
      <Row label="Authentication"   value="JWT + OTP Email Verification" />
      <Row label="Developed For"    value="Sri Vaishnavi Jewellers, Trichy" />
      <Row label="Release Year"     value="2026" />
    </div>

    <div className="rounded-2xl bg-[#fffaf1] px-4 py-3 text-center text-sm text-mocha-700">
      © Sri Vaishnavi Jewellers — All Rights Reserved.
      <br />
      <span className="text-xs">
        Designed and developed for internal stock management use only.
      </span>
    </div>
  </div>
);

export default AboutSettings;
