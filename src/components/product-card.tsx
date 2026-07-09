import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 5;

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={
            isOutOfStock
              ? "object-cover grayscale opacity-50"
              : "object-cover"
          }
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-semibold">
              Habis
            </Badge>
          </div>
        )}
        {!isOutOfStock && isLowStock && (
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/90"
          >
            Sisa {product.stock}
          </Badge>
        )}
      </div>
      <CardContent className="flex flex-col gap-1 px-4 pt-3">
        <span className="text-xs text-muted-foreground">
          {product.category}
        </span>
        <h3 className="line-clamp-1 font-medium">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="px-4 pt-2 pb-4">
        <span className="font-semibold">{formatPrice(product.price)}</span>
      </CardFooter>
    </Card>
  );
}
