import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  { to: "/buscar",    label: "Buscar",    icon: "🔍" },
  { to: "/biblioteca", label: "Biblioteca", icon: "📚" },
  { to: "/perfil",   label: "Perfil",    icon: "👤" },
];

export function Header() {
  const { signOut } = useAuth();
  const { pathname } = useLocation();

  return (
    <header
      style={{
        background: "var(--primary)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 2px 12px rgba(28,25,23,.18)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/biblioteca"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
        >
          <span className="text-xl">📚</span>
          <span className="text-lg font-bold tracking-tight">Mi Biblioteca</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"
                style={{
                  color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
                  background: active ? "rgba(255,255,255,0.14)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="text-base leading-none">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}

          <button
            onClick={signOut}
            className="ml-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.55)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Salir
          </button>
        </nav>
      </div>
    </header>
  );
}
