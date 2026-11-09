# PANDATIX

Sistem tiket wahana realtime, menggunakan Node.js 18+ dan Supabase Postgres sebagai penyimpanan persisten. Tampilan dan alur aplikasi yang ada dipertahankan; perubahan difokuskan pada penyimpanan data dan konfigurasi deployment.

## 1. Siapkan Supabase
1. Buat project di Supabase.
2. Buka **SQL Editor**, lalu jalankan seluruh isi `supabase/schema.sql`.
3. Dari **Project Settings → API**, salin Project URL dan `service_role` key (atau secret key server-side yang kompatibel). Jangan pernah menaruh key ini di file frontend atau repository publik.

## 2. Upload ke GitHub
Upload isi folder `pandatix` ke repository GitHub (file `server.js`, folder `public`, `package.json`, dan folder `supabase` harus berada di root repository). Jangan upload `.env` atau key rahasia.

## 3. Deploy di Deplexo
Buat aplikasi Node.js dari repository tersebut. Gunakan:
- Runtime: **Node.js 18 atau lebih baru**
- Install/build command: `npm install` (tidak ada dependency eksternal)
- Start command: `npm start`
- Port: gunakan variabel `PORT` yang disediakan hosting.

Tambahkan environment variables berikut di pengaturan aplikasi Deplexo:
- `SUPABASE_URL` = Project URL Supabase
- `SUPABASE_SERVICE_ROLE_KEY` = key server-side Supabase
- `ADMIN_PASSWORD` = password awal admin yang kuat dan unik

Lalu deploy/redeploy. Pastikan hosting Deplexo mendukung aplikasi Node.js server yang berjalan terus-menerus dan environment variables. Jangan menggunakan static-only hosting untuk project ini karena API, login, SSE realtime, dan validasi tiket berjalan di `server.js`.

## 4. Halaman aplikasi
- `/` — pelanggan
- `/kasir` — kasir
- `/keuangan` — laporan keuangan
- `/admin` — administrasi
- `/s/<token>` — scan tiket petugas

## Login awal
Saat database kosong, aplikasi membuat akun awal:
- Admin: `admin` / nilai `ADMIN_PASSWORD` yang Anda atur
- Kasir: `kasir01` / `kasir123`
- Keuangan: `keuangan01` / `keuangan123`

Segera ubah kata sandi akun kasir dan keuangan melalui halaman admin. Jika database sudah berisi akun, akun awal tidak dibuat ulang.

## Catatan penting
- `SUPABASE_SERVICE_ROLE_KEY` hanya untuk environment server. Jangan pernah menaruhnya di `public/`, HTML, JavaScript browser, atau commit ke GitHub.
- Database menggunakan satu baris JSONB untuk mempertahankan struktur data aplikasi saat ini dengan perubahan minimal. Ini cocok untuk deployment sederhana/satu instance; bukan desain ideal untuk banyak instance atau beban transaksi besar.
- Jalankan hanya satu instance aplikasi agar tidak terjadi benturan pembaruan state. Pastikan Supabase dan hosting tersedia sebelum aplikasi dimulai.
- Pembayaran digital belum terhubung payment gateway sungguhan; konfirmasi tetap dilakukan kasir sesuai logika aplikasi yang ada.
