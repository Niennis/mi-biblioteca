import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "../components/ui/PasswordInput";

describe("PasswordInput", () => {
  it("renderiza con type='password' por defecto", () => {
    render(<PasswordInput label="Contraseña" />);
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
  });

  it("hace visible la contraseña al presionar el botón toggle", async () => {
    render(<PasswordInput label="Contraseña" />);
    const toggle = screen.getByRole("button", { name: /mostrar contraseña/i });
    await userEvent.click(toggle);
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "text");
  });

  it("vuelve a ocultar al presionar el toggle por segunda vez", async () => {
    render(<PasswordInput label="Contraseña" />);
    const toggle = screen.getByRole("button", { name: /mostrar contraseña/i });
    await userEvent.click(toggle);
    const toggleOcultar = screen.getByRole("button", { name: /ocultar contraseña/i });
    await userEvent.click(toggleOcultar);
    expect(screen.getByLabelText("Contraseña")).toHaveAttribute("type", "password");
  });

  it("muestra el mensaje de error cuando se provee", () => {
    render(<PasswordInput error="Contraseña muy corta" />);
    expect(screen.getByText("Contraseña muy corta")).toBeInTheDocument();
  });

  it("el botón toggle tiene tabIndex=-1 para no interrumpir la navegación", () => {
    render(<PasswordInput />);
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveAttribute("tabindex", "-1");
  });

  it("llama onChange cuando el usuario escribe", async () => {
    const onChange = vi.fn();
    render(<PasswordInput label="Contraseña" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Contraseña"), "abc123");
    expect(onChange).toHaveBeenCalled();
  });
});
