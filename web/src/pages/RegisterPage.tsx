import { Link } from "react-router-dom";
import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--accent)" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-block text-4xl">📚</span>
          <h1
            className="mt-2 text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Mi Biblioteca
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Crea tu cuenta gratuita
          </p>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <RegisterForm />
        </div>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
