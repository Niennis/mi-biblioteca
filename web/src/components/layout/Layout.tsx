import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
