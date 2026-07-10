"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Hapus "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    setPending(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setPending(false);
      window.alert("Gagal menghapus produk.");
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? "Menghapus…" : "Hapus"}
    </Button>
  );
}
