import { FormEvent, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/Input";
import { PasswordInput } from "../ui/PasswordInput";
import { Button } from "../ui/Button";

export function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    }
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
        placeholder="••••••••"
      />
      {error && (
        <p className="rounded-lg px-3 py-2 text-sm font-medium" style={{ background: "var(--danger-light)", color: "var(--danger)" }}>
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
