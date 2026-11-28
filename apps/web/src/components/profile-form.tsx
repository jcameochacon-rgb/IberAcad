"use client";
import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProfile } from "@/app/panel/perfil/actions";
export function ProfileForm({
  telefono,
  direccion,
  avatarUrl,
  name,
}: {
  telefono: string;
  direccion: string;
  avatarUrl?: string;
  name: string;
}) {
  const [message, action, pending] = useActionState(saveProfile, "");
  const [photo, setPhoto] = useState<Blob | null>(null),
    [preview, setPreview] = useState(avatarUrl || ""),
    [error, setError] = useState(""),
    [processing, setProcessing] = useState(false);
  async function choose(file?: File) {
    setError("");
    setPhoto(null);
    setPreview(avatarUrl || "");
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Usa JPG, PNG o WebP de hasta 8 MB.");
      return;
    }
    setProcessing(true);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 384;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 384, 384);
      const size = Math.min(bitmap.width, bitmap.height);
      ctx.drawImage(
        bitmap,
        (bitmap.width - size) / 2,
        (bitmap.height - size) / 2,
        size,
        size,
        0,
        0,
        384,
        384,
      );
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.85),
      );
      if (!blob) throw Error();
      setPhoto(blob);
      setPreview(canvas.toDataURL("image/jpeg", 0.85));
    } catch {
      setError("No se pudo procesar la foto. Elige otra imagen.");
    } finally {
      setProcessing(false);
    }
  }
  return (
    <form
      className="operation-form"
      action={(form) => {
        if (photo) form.set("foto", photo, "avatar.jpg");
        action(form);
      }}
    >
      <div className="profile-editor-heading">
        {!preview && (
          <span className="profile-initials">
            {name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </span>
        )}
        <div>
          <h2>{name}</h2>
          <p>Personaliza tu espacio académico.</p>
        </div>
      </div>
      <p>
        Tu nombre, CI, correo institucional, rol y ficha académica los
        administra la institución. Estos datos de contacto son personales y no
        reemplazan tu ficha oficial.
      </p>
      <label>
        Foto de perfil
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={pending || processing}
          onChange={(e) => choose(e.target.files?.[0])}
        />
      </label>
      {preview && (
        <Image
          unoptimized
          width={120}
          height={120}
          src={preview}
          alt="Vista previa de tu foto"
          className="profile-preview"
        />
      )}
      <label>
        Teléfono personal
        <input name="telefono" maxLength={40} defaultValue={telefono} />
      </label>
      <label>
        Dirección personal
        <input name="direccion" maxLength={300} defaultValue={direccion} />
      </label>
      {error && <p role="alert">{error}</p>}
      <button
        className="portal-button"
        disabled={pending || processing || !!error}
      >
        {pending
          ? "Guardando…"
          : processing
            ? "Procesando foto…"
            : "Guardar mi perfil"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
