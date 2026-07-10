# Ruma54

Aplikasi pemesanan roti online — lihat menu, pesan, dan ambil tanpa antre di toko.

## Prasyarat

- Node.js 20 atau lebih baru (dikembangkan dengan Node 22)
- npm

## Instalasi

```bash
npm install
```

## Menyiapkan database (SQLite)

Proyek ini pakai [Drizzle ORM](https://orm.drizzle.team/) di atas SQLite lewat `better-sqlite3`
(bisa diganti ke [Turso](https://turso.tech/) nanti tanpa mengubah skema, cukup arahkan
`DATABASE_URL` ke database Turso-mu).

Secara default, database disimpan sebagai file lokal `sqlite.db` di root proyek (sudah masuk
`.gitignore`, jangan di-commit). Untuk memakai lokasi/URL lain, set env var `DATABASE_URL`
sebelum menjalankan perintah di bawah.

1. **Jalankan migrasi** untuk membuat semua tabel (`products`, `orders`, `order_items`):

   ```bash
   npm run db:migrate
   ```

2. **Isi data contoh (seed)** — mengisi tabel `products` dengan katalog roti dari
   `src/lib/mock-products.ts`:

   ```bash
   npm run db:seed
   ```

3. **(Opsional) Buka Drizzle Studio** untuk melihat/isi data lewat UI browser:

   ```bash
   npm run db:studio
   ```

Kalau kamu mengubah skema di `src/db/schema.ts`, buat migrasi baru dengan:

```bash
npm run db:generate
```

lalu jalankan `npm run db:migrate` lagi untuk menerapkannya.

## Menjalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Skrip lain

| Skrip | Fungsi |
| --- | --- |
| `npm run build` | Build production |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate file migrasi dari `src/db/schema.ts` |
| `npm run db:migrate` | Terapkan migrasi ke database |
| `npm run db:seed` | Isi tabel `products` dengan data contoh |
| `npm run db:studio` | Buka Drizzle Studio |

## Struktur singkat

- `src/app` — halaman & route (App Router), termasuk `api/` untuk endpoint backend
- `src/components` — komponen UI (termasuk `components/ui` dari shadcn/ui)
- `src/db` — skema Drizzle (`schema.ts`), koneksi DB (`index.ts`), dan skrip seed (`seed.ts`)
- `src/lib` — data mock, helper, dan util bersama
- `drizzle/` — file migrasi SQL yang digenerate `drizzle-kit`
