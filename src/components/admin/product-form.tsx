"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/mock-products";
import type { Product } from "@/lib/types";

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c !== "Semua");

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    stock: product?.stock?.toString() ?? "0",
    imageUrl: product?.imageUrl ?? "",
    category: product?.category ?? SELECTABLE_CATEGORIES[0],
    bakeEtaMinutes: product?.bakeEtaMinutes?.toString() ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      category: form.category,
      bakeEtaMinutes: form.bakeEtaMinutes === "" ? null : Number(form.bakeEtaMinutes),
    };

    const res = await fetch(
      isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      router.push("/admin/produk");
      router.refresh();
      return;
    }

    const body = await res.json().catch(() => null);
    setError(body?.error ?? "Gagal menyimpan");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Nama
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Deskripsi
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          rows={3}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Harga (Rp)
          <Input
            type="number"
            min={0}
            step={1}
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Stok
          <Input
            type="number"
            min={0}
            step={1}
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Kategori
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {SELECTABLE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        URL Gambar
        <Input
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          placeholder="/products/nama-roti.svg"
          required
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Estimasi panggang (menit)
        <Input
          type="number"
          min={0}
          step={1}
          value={form.bakeEtaMinutes}
          onChange={(e) => update("bakeEtaMinutes", e.target.value)}
          placeholder="Kosongkan jika selalu siap"
        />
      </label>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/produk")}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
