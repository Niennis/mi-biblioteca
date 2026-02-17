import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../components/ui/Input";

describe("Input", () => {
  it("renderiza la etiqueta cuando se provee", () => {
    render(<Input label="Correo electrónico" />);
    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
  });

  it("no renderiza etiqueta si no se provee", () => {
    render(<Input placeholder="Sin etiqueta" />);
    expect(screen.queryByRole("generic", { name: /etiqueta/i })).not.toBeInTheDocument();
  });

  it("muestra el mensaje de error cuando se provee", () => {
    render(<Input error="Campo requerido" />);
    expect(screen.getByText("Campo requerido")).toBeInTheDocument();
  });

  it("llama onChange cuando el usuario escribe", async () => {
    const onChange = vi.fn();
    render(<Input label="Nombre" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Ana");
    expect(onChange).toHaveBeenCalled();
  });

  it("acepta value controlado", () => {
    render(<Input value="valor inicial" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("valor inicial");
  });
});
