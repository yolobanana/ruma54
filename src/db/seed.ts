import { db } from "@/db";
import { products } from "@/db/schema";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

function seed() {
  for (const product of MOCK_PRODUCTS) {
    db.insert(products)
      .values({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        category: product.category,
        bakeEtaMinutes: product.bakeEtaMinutes ?? null,
      })
      .onConflictDoNothing()
      .run();
  }

  console.log(`Seeded ${MOCK_PRODUCTS.length} products.`);
}

seed();
