"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X } from "lucide-react";
import { supabase, LABS_IMAGES_BUCKET, publicImageUrl } from "@/lib/supabase";

interface ImageUploaderProps {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  folder?: string;
}

export default function ImageUploader({ label, value, onChange, folder = "productos" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(LABS_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      onChange(path);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir la imagen";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  const previewUrl = publicImageUrl(value);

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-graphite-700">{label}</p>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-mist-300 bg-mist-100">
          {previewUrl ? (
            <Image src={previewUrl} alt={label} width={96} height={96} className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-5 w-5 text-graphite-500" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full border border-mist-300 bg-white px-4 py-2 text-xs font-semibold text-graphite-700 hover:border-brand/40 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {value ? "Reemplazar imagen" : "Subir imagen"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1 text-xs font-medium text-graphite-500 hover:text-red-600"
            >
              <X className="h-3 w-3" /> Quitar
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
