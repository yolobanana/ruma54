"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ArchiveProductButton({
  id,
  name,
  archived,
}: {
  id: string;
  name: string;
  archived: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function archive() {
    if (
      !window.confirm(
        `Arsipkan "${name}"? Roti akan disembunyikan dari toko, tapi riwayat pesanan tetap aman.`
      )
    ) {
      return;
    }
    setPending(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    finish(res.ok);
  }

  async function restore() {
    setPending(true);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: false }),
    });
    finish(res.ok);
  }

  function finish(ok: boolean) {
    if (ok) {
      router.refresh();
    } else {
      setPending(false);
      window.alert("Gagal memproses. Coba lagi.");
    }
  }

  if (archived) {
    return (
      <Button variant="outline" size="sm" onClick={restore} disabled={pending}>
        {pending ? "…" : "Pulihkan"}
      </Button>
    );
  }

  return (
    <Button variant="destructive" size="sm" onClick={archive} disabled={pending}>
      {pending ? "…" : "Arsipkan"}
    </Button>
  );
}
