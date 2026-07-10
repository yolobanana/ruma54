"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StockAdjuster({
  id,
  stock,
}: {
  id: string;
  stock: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(stock.toString());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  const parsed = Number(value);
  const changed = Number.isInteger(parsed) && parsed >= 0 && parsed !== stock;

  function bump(delta: number) {
    setValue((prev) => {
      const next = Math.max(0, (Number(prev) || 0) + delta);
      return next.toString();
    });
  }

  async function save() {
    if (!changed) return;
    setPending(true);
    setError(false);
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: parsed }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError(true);
    }
    setPending(false);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => bump(-1)}
        aria-label="Kurangi stok"
        disabled={pending}
      >
        −
      </Button>
      <Input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8 w-20 text-center"
        aria-invalid={error}
        disabled={pending}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => bump(1)}
        aria-label="Tambah stok"
        disabled={pending}
      >
        +
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={save}
        disabled={!changed || pending}
      >
        {pending ? "…" : "Simpan"}
      </Button>
    </div>
  );
}
