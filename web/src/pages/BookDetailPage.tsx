import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserBook, ReadingStatus } from "../types/library";
import { getLibraryBook, updateLibraryBook, removeFromLibrary } from "../services/library.api";
import { StatusSelect } from "../components/ui/StatusSelect";
import { StarRating } from "../components/ui/StarRating";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { ImageUpload } from "../components/library/ImageUpload";
import { formatDateShort } from "../utils/date";

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userBook, setUserBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getLibraryBook(id)
      .then((data) => {
        setUserBook(data);
        setComment(data.comment ?? "");
        setStartDate(data.startDate ? data.startDate.split("T")[0]! : "");
        setEndDate(data.endDate ? data.endDate.split("T")[0]! : "");
      })
      .catch(() => navigate("/biblioteca"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !userBook) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  const { book } = userBook;

  async function update(data: Parameters<typeof updateLibraryBook>[1]) {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await updateLibraryBook(id, data);
      setUserBook(updated);
    } catch {
      // handled silently
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(status: ReadingStatus) { await update({ status }); }
  async function handleFavorite() { await update({ isFavorite: !userBook!.isFavorite }); }
  async function handleRating(rating: number) { await update({ rating: rating || null }); }
  async function handleSaveComment() { await update({ comment: comment || null }); }
  async function handleSaveDates() {
    await update({
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
    });
  }
  async function handleImages(images: string[]) { await update({ personalImages: images }); }
  async function handleDelete() {
    if (!id || !confirm("¿Quitar este libro de tu biblioteca?")) return;
    await removeFromLibrary(id);
    navigate("/biblioteca");
  }

  const section = (children: React.ReactNode) => (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
    >
      {children}
    </div>
  );

  const fieldLabel = (text: string) => (
    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-faint)" }}>
      {text}
    </label>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <button
        onClick={() => navigate("/biblioteca")}
        className="text-sm font-semibold transition-opacity hover:opacity-70"
        style={{ color: "var(--primary)" }}
      >
        ← Volver a la biblioteca
      </button>

      {/* Header del libro */}
      {section(
        <div className="flex gap-5">
          <div
            className="h-48 w-32 flex-shrink-0 overflow-hidden rounded-xl"
            style={{ background: "var(--surface-alt)", boxShadow: "var(--shadow)" }}
          >
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-center p-2" style={{ color: "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                Sin portada
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            <h1
              className="text-xl font-bold leading-snug"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              {book.title}
            </h1>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {book.authors.join(", ")}
            </p>
            {book.publishedDate && (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{book.publishedDate}</p>
            )}
            {book.pageCount && (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{book.pageCount} páginas</p>
            )}
            {book.categories.length > 0 && (
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>{book.categories.join(", ")}</p>
            )}
          </div>
        </div>
      )}

      {book.description && section(
        <>
          {fieldLabel("Descripción")}
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {book.description}
          </p>
        </>
      )}

      {/* Mi información */}
      {section(
        <>
          <h2
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Mi información
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <div>
              {fieldLabel("Estado")}
              <StatusSelect value={userBook.status} onChange={handleStatusChange} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className="text-2xl transition-all duration-150 hover:scale-110"
                style={{ color: userBook.isFavorite ? "var(--accent)" : "var(--border)" }}
              >
                ♥
              </button>
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {userBook.isFavorite ? "Favorito" : "Marcar favorito"}
              </span>
            </div>
          </div>

          <div>
            {fieldLabel("Calificación")}
            <StarRating value={userBook.rating} onChange={handleRating} />
          </div>

          <div>
            {fieldLabel("Comentario")}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-150"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--border-focus)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(44,74,62,.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <Button size="sm" variant="secondary" onClick={handleSaveComment} disabled={saving} className="mt-2">
              Guardar comentario
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              {fieldLabel("Fecha inicio")}
              <div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
                />
                {startDate && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
                    {formatDateShort(startDate)}
                  </p>
                )}
              </div>
            </div>
            <div>
              {fieldLabel("Fecha fin")}
              <div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--text)" }}
                />
                {endDate && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
                    {formatDateShort(endDate)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button size="sm" variant="secondary" onClick={handleSaveDates} disabled={saving}>
                Guardar fechas
              </Button>
            </div>
          </div>

          <div>
            {fieldLabel("Imágenes personales")}
            <ImageUpload images={userBook.personalImages} onChange={handleImages} />
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        {saving && (
          <p className="text-sm font-medium" style={{ color: "var(--text-faint)" }}>
            Guardando...
          </p>
        )}
        <div className="ml-auto">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Quitar de mi biblioteca
          </Button>
        </div>
      </div>
    </div>
  );
}
