import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";

export function RegisterForm() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg px-4 py-5 text-center" style={{ background: "var(--success-light)", color: "var(--success)" }}>
        <p className="font-semibold">¡Cuenta creada con éxito!</p>
        <p className="mt-1 text-sm opacity-80">Revisa tu correo para confirmar tu cuenta.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="tu@correo.com"
      />
      <PasswordInput
        label="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Mínimo 6 caracteres"
      />
      <PasswordInput
        label="Confirmar contraseña"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        placeholder="Repite tu contraseña"
      />
      {error && (
        <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  );
}
