import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../components/ui/Button";

describe("Button", () => {
  it("renderiza el texto de sus hijos", () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("llama onClick cuando se hace clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clic</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("no llama onClick cuando está deshabilitado", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} disabled>Deshabilitado</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("tiene el atributo disabled cuando disabled=true", () => {
    render(<Button disabled>Inactivo</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renderiza con type='submit' cuando se especifica", () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
