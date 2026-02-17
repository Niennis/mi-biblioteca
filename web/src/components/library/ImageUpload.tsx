import { useRef } from "react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { Button } from "../ui/Button";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: Props) {
  const { upload, remove, uploading } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file);
      onChange([...images, url]);
    } catch (err: any) {
      alert(err.message);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(url: string) {
    await remove(url);
    onChange(images.filter((i) => i !== url));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="group relative h-20 w-20 overflow-hidden rounded-lg">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => handleRemove(url)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-white text-sm"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Agregar imagen"}
      </Button>
    </div>
  );
}
