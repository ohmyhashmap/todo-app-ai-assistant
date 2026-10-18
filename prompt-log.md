# Prompt Log

Dokumen ini mencatat proses penggunaan Generative AI dalam pengembangan aplikasi.

## Format Catatan

- Tanggal:
- Tujuan:
- Prompt:
- Output AI:
- Evaluasi:
- Bug/Masalah:
- Perbaikan:
- Alasan keputusan:

---

## Catatan 1

- Tanggal: 10/11/2026
- Tujuan: Meminta rancangan awal aplikasi To-Do List sederhana dan struktur file yang sesuai untuk Tugas I.
- Prompt:
  "Saya ingin membuat aplikasi web To-Do List sederhana untuk tugas kuliah. Fitur minimal: tambah tugas, menampilkan daftar tugas, menandai selesai/belum selesai, menghapus tugas, filter semua/aktif/selesai, dan menyimpan data di localStorage. Saya ingin menggunakan HTML, CSS, dan JavaScript vanilla tanpa framework dan tanpa backend. Tolong berikan struktur file yang sederhana, penjelasan fungsi tiap file, dan rancangan fitur dasarnya. Jangan langsung membuat kode lengkap, cukup rancangan awal dan struktur folder."

- Output AI (ringkas):
  AI menyarankan struktur file `index.html`, `style.css`, dan `app.js`, dengan `localStorage` untuk menyimpan data. AI juga menyarankan fitur tambah tugas, tandai selesai, hapus, dan filter. Namun AI sempat menyarankan penggunaan framework dan penambahan fitur prioritas/ deadline yang tidak diperlukan untuk tugas sederhana.

- Evaluasi:
  Struktur file dari AI sudah sesuai, tetapi beberapa saran terlalu berlebihan untuk tugas sederhana. Saya memilih tetap menggunakan HTML, CSS, dan JavaScript vanilla tanpa framework agar aplikasi mudah dipahami, cepat dibuat, dan mudah didokumentasikan di proposal. Fitur prioritas dan deadline tidak dipakai karena di luar kebutuhan minimal.

- Bug/Masalah:
  Pada tahap ini belum ada kode yang dijalankan. Namun ada potensi masalah: jika data di `localStorage` masih kosong, proses pembacaan data bisa error jika tidak ditangani dengan benar.

- Perbaikan:
  Pada prompt berikutnya, saya akan menegaskan agar AI hanya menggunakan JavaScript vanilla dan menambahkan penanganan data kosong dari `localStorage`, misalnya menggunakan `JSON.parse(localStorage.getItem('todos')) || []`.

- Alasan keputusan:
  Saya memilih versi sederhana karena lebih sesuai dengan batas waktu 1 minggu, lebih mudah diuji, dan lebih mudah dijelaskan dalam proposal. Saya juga mencatat saran AI yang tidak dipakai sebagai bukti evaluasi kritis terhadap output AI.

## Catatan 2

- Tanggal: 10/11/2026
- Tujuan: Meminta kode lengkap aplikasi To-Do List (HTML, CSS, JS vanilla) dengan 6 fitur wajib dan penanganan localStorage kosong.
- Prompt: (lihat screenshots/Hari 1.3.png)

- Output AI (ringkas):
  AI memberikan kode lengkap untuk index.html, style.css, dan app.js. Struktur sudah dipisah 3 file. Fitur tambah, toggle selesai, hapus, dan filter sudah diimplementasikan. Penanganan localStorage kosong sudah disertakan melalui `JSON.parse(localStorage.getItem('todos')) || []`. AI juga memberikan penjelasan singkat per bagian kode.

- Evaluasi:
  Secara umum output AI sudah sesuai instruksi dan langsung bisa dijalankan untuk 6 skenario uji utama. Namun ada 2 celah:
  1. `JSON.parse` tidak dibungkus `try/catch`, sehingga jika isi localStorage korup (bukan JSON valid), aplikasi crash sebelum operator `||` sempat dievaluasi.
  2. `Date.now()` sebagai ID berisiko duplikat jika dua tugas ditambahkan dalam milidetik yang sama — kecil kemungkinan, tapi tetap patut dicatat.

- Bug/Masalah:
  Setelah menjalankan `localStorage.setItem('todos', 'data-rusak')` di console lalu me-refresh halaman, muncul error `Uncaught SyntaxError: Unexpected token 'd', "data-rusak" is not valid JSON`, dan daftar tugas tidak dapat dirender. (screenshots/bug-hari2.png)

- Perbaikan:
  Membungkus pembacaan data dengan try/catch:

  ```js

  let todos;
  try {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
  } catch (e) {
    todos = [];
    localStorage.removeItem('todos');
  }

## Catatan 3

- Tanggal: 10/11/2026
- Tujuan: Menambahkan fitur "Hapus Semua Selesai" sebagai iterasi kedua dan
  merapikan tampilan (empty state + counter tugas).

- Prompt: (lihat screenshots/Hari 1.9.png)
  Prompt meminta AI hanya mengirim diff/potongan kode yang berubah, tidak
  mengubah struktur file, tidak mengubah fitur lain, tombol harus disabled
  saat tidak ada tugas selesai, dan ada konfirmasi sebelum hapus.

- Output AI (ringkas):
  AI memberikan potongan kode untuk index.html, style.css, dan app.js sesuai
  format yang diminta (diff, bukan file utuh). Tombol "Hapus Semua Selesai"
  ditambahkan dengan atribut `disabled` awal di HTML, dan diperbarui secara
  dinamis di `renderTodos()` menggunakan `todos.some(todo => todo.completed)`.
  Event listener memakai `confirm()` sebelum mengeksekusi `.filter()` untuk
  menyisakan tugas yang belum selesai.

- Evaluasi:
  AI kali ini mengikuti seluruh instruksi eksplisit, termasuk yang biasanya
  terlewat (disabled state). Format output juga sesuai permintaan (hanya diff).
  Dua catatan kecil:
  1. Pesan konfirmasi masih generik ("Apakah Anda yakin...") tanpa jumlah
     tugas yang akan dihapus — kurang informatif.
  2. Empty state dan counter tugas tidak termasuk dalam output, karena memang
     tidak diminta di prompt. Bagian ini saya tambahkan sendiri sebagai
     keputusan desain.

- Bug/Masalah:
  Saat mengintegrasikan kode AI dengan empty state manual saya, muncul bug
  baru: karena empty state diletakkan sebelum update `clearCompletedBtn.disabled`
  dan diakhiri dengan `return`, baris update disabled terlewat setiap kali
  daftar kosong, sehingga tombol tetap disabled meski status berubah.

- Perbaikan:
  1. Menghapus `return` pada blok empty state dan mengubah struktur menjadi
     `if/else` agar bagian akhir `renderTodos()` (counter dan disabled)
     selalu dieksekusi.
  2. Menambahkan hitungan pada pesan konfirmasi:
     `Hapus ${count} tugas yang sudah selesai?`.

- Alasan keputusan:
  Integrasi manual dengan kode AI tidak otomatis aman — perlu dibaca dan
  dipahami alurnya. Bug `return` di atas adalah contoh nyata bahwa AI tidak
  bisa disalahkan sepenuhnya; kesalahan justru terjadi saat saya menempelkan
  kode tambahan tanpa memeriksa konsekuensi terhadap alur fungsi yang dibuat AI.
  Konfirmasi dengan jumlah membuat pengguna tahu persis dampak tindakannya.

## Catatan 4

- Tanggal: 10/11/2026
- Tujuan: Final testing end-to-end dan konsolidasi hasil iterasi.

- Ringkasan Pengujian:
  Dilakukan 9 skenario pengujian manual di Chrome: kondisi kosong,
  tambah tugas, toggle selesai, filter aktif/selesai, persistensi setelah
  refresh, hapus semua selesai, dan simulasi data localStorage korup.
  Seluruh skenario berjalan sesuai harapan.

- Temuan:
  1. try-catch pada pembacaan localStorage terbukti mencegah crash
     ketika data korup disuntik manual.
  2. Update counter dan status tombol hapus-selesai berjalan konsisten
     setelah dipindahkan ke dalam renderTodos().
  3. Tidak ditemukan regresi setelah penambahan empty state dan fitur
     hapus-selesai.

- Keputusan:
  Tidak ada fitur baru pada tahap ini. Fokus pada verifikasi akhir
  dan penyusunan dokumentasi (screenshot + kerangka proposal) sebelum
  penulisan proposal lengkap.

- Alasan:
  Memastikan hasil akhir stabil sebelum masuk ke tahap dokumentasi,
  sehingga proposal yang ditulis mencerminkan kondisi aplikasi yang
  benar-benar diuji, bukan asumsi.
