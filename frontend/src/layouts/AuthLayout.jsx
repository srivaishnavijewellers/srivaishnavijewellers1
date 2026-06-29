import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <main className="flex min-h-screen items-center justify-center px-4 py-8">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-20 top-20 h-56 w-56 rounded-full bg-gold-100/50 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-mocha-700/10 blur-3xl" />
    </div>
    <div className="relative z-10 w-full max-w-md">
      <Outlet />
    </div>
  </main>
);

export default AuthLayout;

