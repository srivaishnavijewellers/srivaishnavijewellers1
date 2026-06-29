const AuthCard = ({ title, subtitle, children, footer }) => (
  <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-card backdrop-blur">
    <header className="mb-8 text-center">
      <p className="font-display text-2xl font-semibold tracking-wide text-mocha-900">
        Sri Vaishnavi Jewellers
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.35em] text-gold-700">
        Stock Management Portal
      </p>
      <h1 className="mt-6 font-display text-3xl text-mocha-900">{title}</h1>
      <p className="mt-2 text-sm text-mocha-700">{subtitle}</p>
    </header>
    {children}
    {footer ? <footer className="mt-6 text-center">{footer}</footer> : null}
  </section>
);

export default AuthCard;

