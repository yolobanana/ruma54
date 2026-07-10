import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Tambah Produk</h1>
        <p className="text-sm text-muted-foreground">
          Isi detail roti baru.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
