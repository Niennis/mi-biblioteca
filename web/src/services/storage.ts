import { supabase } from "../config/supabase";

export async function uploadBookImage(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("book-images")
    .upload(path, file);

  if (error) throw new Error("Error al subir imagen: " + error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("book-images").getPublicUrl(path);

  return publicUrl;
}

export async function deleteBookImage(url: string) {
  const path = url.split("/book-images/")[1];
  if (!path) return;
  await supabase.storage.from("book-images").remove([path]);
}

export async function uploadAvatarImage(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (error) throw new Error("Error al subir foto: " + error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  return publicUrl;
}
