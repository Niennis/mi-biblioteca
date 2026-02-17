import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mock useAuth ─────────────────────────────────────
const mockSignIn = vi.hoisted(() => vi.fn());

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

import { LoginForm } from "../components/auth/LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    mockSignIn.mockResolvedValue({ error: undefined });
    vi.clearAllMocks();
  });

  it("renderiza campo de correo y contraseña", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument();
  });

  it("el campo de contraseña tiene toggle para mostrar/ocultar", () => {
    render(<LoginForm />);
    expect(screen.getByRole("button", { name: /mostrar contraseña/i })).toBeInTheDocument();
  });

  it("llama signIn con los valores del formulario al enviar", async () => {
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "ana@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("ana@test.com", "password123");
    });
  });

  it("muestra mensaje de error cuando signIn falla", async () => {
    mockSignIn.mockResolvedValue({ error: "Credenciales inválidas" });
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "mal@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
    });
  });

  it("muestra estado de carga mientras se procesa el inicio de sesión", async () => {
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: undefined }), 100))
    );
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "a@b.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "123456");
    await userEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
  });
});
