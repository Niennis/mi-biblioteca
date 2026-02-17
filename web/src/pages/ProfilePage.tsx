import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { uploadAvatarImage } from "../services/storage";
import { UserBook, STATUS_LABELS, ReadingStatus } from "../types/library";
import { Profile } from "../types/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { formatDate } from "../utils/date";

const STATUS_ICONS: Record<ReadingStatus, string> = {
  QUIERO_LEER: "🔖",
  LEYENDO:     "📖",
  LEIDO:       "✅",
  ABANDONADO:  "❌",
};

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Record<ReadingStatus, number> | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [p, books] = await Promise.all([
          api<Profile>("/profile"),
          api<UserBook[]>("/library"),
        ]);
        setProfile(p);
        setName(p.name ?? "");
        const counts = { QUIERO_LEER: 0, LEYENDO: 0, LEIDO: 0, ABANDONADO: 0 };
        books.forEach((b) => counts[b.status]++);
        setStats(counts);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api<Profile>("/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: name || undefined }),
      });
      setProfile(updated);
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Solo se permiten imágenes JPG, PNG, WebP o GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("La imagen debe pesar menos de 5 MB");
      return;
    }

    setAvatarError("");
    setUploadingAvatar(true);
    try {
      const url = await uploadAvatarImage(user.id, file);
      const updated = await api<Profile>("/profile", {
        method: "PATCH",
        body: JSON.stringify({ avatarUrl: url }),
      });
      setProfile(updated);
    } catch (err: any) {
      setAvatarError(err.message ?? "Error al subir la foto");
    } finally {
      setUploadingAvatar(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const initials = (profile?.name ?? user?.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1
        className="text-3xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        Mi Perfil
      </h1>

      {/* ── Avatar + datos ───────────────────────────── */}
      <div
        className="rounded-2xl p-6 space-y-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Foto de perfil"
                className="h-24 w-24 rounded-full object-cover"
                style={{ border: "3px solid var(--border)", boxShadow: "var(--shadow)" }}
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white select-none"
                style={{ background: "var(--primary)", boxShadow: "var(--shadow)" }}
              >
                {initials}
              </div>
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ background: "rgba(28,25,23,0.45)" }}
            >
              {uploadingAvatar ? (
                <Spinner className="h-5 w-5 text-white" />
              ) : (
                <span className="text-white text-xs font-semibold">Cambiar</span>
              )}
            </div>
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />

          {avatarError && (
            <p className="text-xs font-medium text-center" style={{ color: "var(--danger)" }}>
              {avatarError}
            </p>
          )}

          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            Haz clic en la foto para cambiarla · JPG, PNG, WebP · Máx 5 MB
          </p>
        </div>

        <hr style={{ borderColor: "var(--border)" }} />

        {/* Datos */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
              Correo electrónico
            </label>
            <p className="text-sm" style={{ color: "var(--text)" }}>{user?.email}</p>
          </div>

          <Input
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* ── Estadísticas ─────────────────────────────── */}
      {stats && (
        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
        >
          <h2
            className="mb-4 text-lg font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Estadísticas de lectura
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(stats) as [ReadingStatus, number][]).map(([status, count]) => (
              <div
                key={status}
                className="rounded-xl p-4 text-center"
                style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
              >
                <span className="text-2xl">{STATUS_ICONS[status]}</span>
                <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {count}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {STATUS_LABELS[status]}
                </p>
              </div>
            ))}

            <div
              className="col-span-2 rounded-xl p-4 text-center"
              style={{ background: "var(--primary-light)", border: "1px solid var(--border)" }}
            >
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {Object.values(stats).reduce((a, b) => a + b, 0)}
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>
                libros en total
              </p>
            </div>
          </div>
        </div>
      )}

      {profile && (
        <p className="text-center text-xs" style={{ color: "var(--text-faint)" }}>
          Cuenta creada el {formatDate(profile.createdAt)}
        </p>
      )}
    </div>
  );
}
