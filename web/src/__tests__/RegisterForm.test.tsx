import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ── Mock useAuth ─────────────────────────────────────
const mockSignUp = vi.hoisted(() => vi.fn());

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ signUp: mockSignUp }),
}));

import { RegisterForm } from "../components/auth/RegisterForm";

describe("RegisterForm", () => {
  beforeEach(() => {
    mockSignUp.mockResolvedValue({ error: undefined });
    vi.clearAllMocks();
  });

  function fillRegisterForm(password: string, confirm: string) {
    return async () => {
      await userEvent.type(screen.getByLabelText(/correo electrónico/i), "ana@test.com");
      await userEvent.type(screen.getByLabelText(/^contraseña$/i), password);
      await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), confirm);
    };
  }

  it("muestra error cuando las contraseñas no coinciden", async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "ana@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "abc123");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "xyz999");
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/no coinciden/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("muestra error cuando la contraseña es muy corta", async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "ana@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "abc");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "abc");
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("muestra mensaje de éxito al crear la cuenta correctamente", async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "nueva@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText(/cuenta creada/i)).toBeInTheDocument();
    });
  });

  it("muestra el error del servidor cuando signUp falla", async () => {
    mockSignUp.mockResolvedValue({ error: "Este correo ya está registrado" });
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "existe@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "password123");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(screen.getByText("Este correo ya está registrado")).toBeInTheDocument();
    });
  });

  it("llama signUp con email y contraseña correctos", async () => {
    render(<RegisterForm />);
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), "nueva@test.com");
    await userEvent.type(screen.getByLabelText(/^contraseña$/i), "mipassword");
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), "mipassword");
    await userEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("nueva@test.com", "mipassword");
    });
  });
});
