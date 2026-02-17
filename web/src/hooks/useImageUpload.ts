import { useState } from "react";
import { useAuth } from "./useAuth";
import { uploadBookImage, deleteBookImage } from "../services/storage";

export function useImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function upload(file: File): Promise<string> {
    if (!user) throw new Error("No autenticado");
    setUploading(true);
    try {
      return await uploadBookImage(user.id, file);
    } finally {
      setUploading(false);
    }
  }

  async function remove(url: string) {
    await deleteBookImage(url);
  }

  return { upload, remove, uploading };
}
