import { Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      {/* Decorative background shapes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="inline-block text-4xl">📚</span>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Mi Biblioteca
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Bienvenido de vuelta
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
