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

## Catatan 1 — Iterasi 1: Rancangan Awal

- Tanggal: 10/11/2026
- Tujuan: Meminta rancangan awal aplikasi To-Do List sederhana dan struktur file yang sesuai untuk Tugas I.
- Prompt: (lihat `screenshots/prompts/01-iterasi1-prompt.png`)
  "Saya ingin membuat aplikasi web To-Do List sederhana untuk tugas kuliah. Fitur minimal: tambah tugas, menampilkan daftar tugas, menandai selesai/belum selesai, menghapus tugas, filter semua/aktif/selesai, dan menyimpan data di localStorage. Saya ingin menggunakan HTML, CSS, dan JavaScript vanilla tanpa framework dan tanpa backend. Tolong berikan struktur file yang sederhana, penjelasan fungsi tiap file, dan rancangan fitur dasarnya. Jangan langsung membuat kode lengkap, cukup rancangan awal dan struktur folder."

- Output AI (ringkas): (lihat `screenshots/prompts/02-iterasi1-output.png`)
  AI menyarankan struktur file `index.html`, `style.css`, dan `app.js`, dengan `localStorage` untuk menyimpan data. AI juga menyarankan fitur tambah tugas, tandai selesai, hapus, dan filter. Namun AI sempat menyarankan penggunaan framework dan penambahan fitur prioritas/deadline yang tidak diperlukan untuk tugas sederhana.

- Evaluasi:
  Struktur file dari AI sudah sesuai, tetapi beberapa saran terlalu berlebihan untuk tugas sederhana. Saya memilih tetap menggunakan HTML, CSS, dan JavaScript vanilla tanpa framework agar aplikasi mudah dipahami, cepat dibuat, dan mudah didokumentasikan di proposal. Fitur prioritas dan deadline tidak dipakai karena di luar kebutuhan minimal.

- Bug/Masalah:
  Pada tahap ini belum ada kode yang dijalankan. Namun ada potensi masalah: jika data di `localStorage` masih kosong, proses pembacaan data bisa error jika tidak ditangani dengan benar.

- Perbaikan:
  Pada prompt berikutnya, saya menegaskan agar AI hanya menggunakan JavaScript vanilla dan menambahkan penanganan data kosong dari `localStorage`.

- Alasan keputusan:
  Saya memilih versi sederhana karena lebih sesuai dengan batas waktu 1 minggu, lebih mudah diuji, dan lebih mudah dijelaskan dalam proposal. Saya juga mencatat saran AI yang tidak dipakai sebagai bukti evaluasi kritis terhadap output AI.

---

## Catatan 2 — Iterasi 2: Implementasi Kode

- Tanggal: 10/11/2026
- Tujuan: Meminta kode lengkap aplikasi To-Do List (HTML, CSS, JS vanilla) dengan 6 fitur wajib dan penanganan localStorage kosong.
- Prompt: (lihat `screenshots/prompts/03-iterasi2-prompt.png`)
  Prompt meminta kode lengkap untuk tiga file terpisah, 6 fitur wajib, tanpa framework, tanpa backend, dan penanganan `localStorage` kosong yang aman.

- Output AI (ringkas): (lihat `screenshots/prompts/04-iterasi2-output.png`, `05-iterasi2-output.png`, `06-iterasi2-output.png` — output panjang sehingga di-screenshot dalam tiga bagian)
  AI memberikan kode lengkap untuk `index.html`, `style.css`, dan `app.js`. Struktur sudah dipisah 3 file. Fitur tambah, toggle selesai, hapus, dan filter sudah diimplementasikan. Penanganan `localStorage` kosong disertakan melalui `JSON.parse(localStorage.getItem('todos')) || []`. AI juga memberikan penjelasan singkat per bagian kode.

- Evaluasi:
  Secara umum output AI sudah sesuai instruksi dan langsung bisa dijalankan untuk 6 skenario uji utama. Namun ada 2 celah:
  1. `JSON.parse` tidak dibungkus `try/catch`, sehingga jika isi `localStorage` korup (bukan JSON valid), aplikasi crash sebelum operator `||` sempat dievaluasi.
  2. `Date.now()` sebagai ID berisiko duplikat jika dua tugas ditambahkan dalam milidetik yang sama — kecil kemungkinan, tapi tetap patut dicatat.

- Bug/Masalah:
  Setelah menjalankan `localStorage.setItem('todos', 'data-rusak')` di console lalu me-refresh halaman, muncul error `Uncaught SyntaxError: Unexpected token 'd', "data-rusak" is not valid JSON`, dan daftar tugas tidak dapat dirender. (lihat `screenshots/bugs/bug-01-localstorage.png`)

- Perbaikan:
  Membungkus pembacaan data dengan `try/catch` (lihat `screenshots/bugs/fix-01-try-catch.png`):

  ```javascript
  let todos;
  try {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
  } catch (e) {
    todos = [];
    localStorage.removeItem('todos');
  }
  ```

- Alasan keputusan:
  Data `localStorage` bisa korup karena ekstensi browser, proses save yang terhenti (crash/tab ditutup paksa), atau skema data lama. Penanganan `try/catch` membuat aplikasi tidak pernah crash total tanpa penjelasan, meski kasus ini jarang terjadi pada pengguna normal.

---

## Catatan 3 — Iterasi 3: Fitur Hapus Semua Selesai

- Tanggal: 10/11/2026
- Tujuan: Menambahkan fitur "Hapus Semua Selesai" sebagai iterasi ketiga, sekaligus merapikan tampilan (empty state + counter tugas) secara manual.
- Prompt: (lihat `screenshots/prompts/07-iterasi3-prompt.png`)
  Prompt meminta AI hanya mengirim diff/potongan kode yang berubah, tidak mengubah struktur file, tidak mengubah fitur lain, tombol harus disabled saat tidak ada tugas selesai, dan ada konfirmasi sebelum hapus.

- Output AI (ringkas): (lihat `screenshots/prompts/08-iterasi3-output.png` dan `09-iterasi3-output.png` — output di-screenshot dalam dua bagian)
  AI memberikan potongan kode untuk `index.html`, `style.css`, dan `app.js` sesuai format yang diminta (diff, bukan file utuh). Tombol "Hapus Semua Selesai" ditambahkan dengan atribut `disabled` awal di HTML, dan diperbarui secara dinamis di `renderTodos()` menggunakan `todos.some(todo => todo.completed)`. Event listener memakai `confirm()` sebelum mengeksekusi `.filter()` untuk menyisakan tugas yang belum selesai.

- Evaluasi:
  AI mengikuti seluruh instruksi eksplisit, termasuk `disabled` state. Format output juga sesuai permintaan (hanya diff). Dua catatan kecil:
  1. Pesan konfirmasi masih generik ("Apakah Anda yakin...") tanpa jumlah tugas yang akan dihapus — kurang informatif.
  2. Empty state dan counter tugas tidak termasuk dalam output, karena memang tidak diminta di prompt. Bagian ini saya tambahkan sendiri sebagai keputusan desain.

- Bug/Masalah:
  Saat mengintegrasikan kode AI dengan empty state manual saya, muncul bug baru: karena empty state diletakkan sebelum update `clearCompletedBtn.disabled` dan diakhiri dengan `return`, baris update disabled terlewat setiap kali daftar kosong, sehingga tombol tetap aktif meski status seharusnya berubah. (lihat `screenshots/bugs/bug-02-return-empty-state.png`). Selain itu, counter tugas yang awalnya diletakkan di luar `renderTodos()` tidak ikut berubah saat tambah/toggle/hapus (lihat `screenshots/bugs/bug-03-counter.png`).

- Perbaikan:
  1. Menghapus `return` pada blok empty state dan mengubah struktur menjadi `if/else` agar bagian akhir `renderTodos()` (counter dan disabled) selalu dieksekusi (lihat `screenshots/bugs/fix-02-return-empty-state.png`).
  2. Memindahkan update counter ke dalam `renderTodos()` (lihat `screenshots/bugs/fix-03-counter.png`).
  3. Menambahkan hitungan pada pesan konfirmasi: `Hapus ${count} tugas yang sudah selesai?`.

- Alasan keputusan:
  Integrasi manual dengan kode AI tidak otomatis aman — perlu dibaca dan dipahami alurnya. Bug `return` dan bug counter adalah contoh nyata bahwa AI tidak bisa disalahkan sepenuhnya; kesalahan justru terjadi saat saya menempelkan kode tambahan tanpa memeriksa konsekuensi terhadap alur fungsi yang dibuat AI. Konfirmasi dengan jumlah membuat pengguna tahu persis dampak tindakannya.

---

## Catatan 4 — Reproduksi Bug untuk Dokumentasi

- Tanggal: 10/11/2026
- Tujuan: Mereproduksi Bug #2 dan Bug #3 secara terpisah untuk keperluan dokumentasi proposal.

- Metode:
  Dibuat dua file demo terpisah yang masing-masing hanya memuat SATU bug, agar efeknya bisa diisolasi dan difoto tanpa gangguan bug lain. File demo dihapus setelah screenshot diambil.

- Bukti:
  - Bug #2: `screenshots/bugs/bug-02-return-empty-state.png` (tombol tetap aktif setelah tugas dihapus, daftar kosong) dan `screenshots/bugs/fix-02-return-empty-state.png` (setelah perbaikan).
  - Bug #3: `screenshots/bugs/bug-03-counter.png` (counter tetap "0 dari 0" padahal ada tugas) dan `screenshots/bugs/fix-03-counter.png` (setelah perbaikan).

- Kesimpulan:
  Kedua bug bersifat UI-synchronization: state data (`todos`) benar, tetapi tampilan tidak ikut menyesuaikan karena alur render yang salah. Perbaikannya sama-sama menyangkut penempatan update di dalam `renderTodos()`.

---

## Catatan 5 — Final Testing End-to-End

- Tanggal: 10/11/2026
- Tujuan: Final testing end-to-end dan konsolidasi hasil iterasi.

- Metode:
  Dilakukan 8 skenario pengujian manual di Zen Browser dan VS Code Integrated Browser: kondisi kosong, tambah tugas, toggle selesai, filter aktif, filter selesai, persistensi setelah refresh, hapus semua selesai, dan simulasi data `localStorage` korup. Setiap skenario dijalankan dari state bersih (`localStorage.clear()`).

- Temuan:
  1. `try/catch` pada pembacaan `localStorage` terbukti mencegah crash ketika data korup disuntik manual.
  2. Update counter dan status tombol hapus-selesai berjalan konsisten setelah dipindahkan ke dalam `renderTodos()`.
  3. Tidak ditemukan regresi setelah penambahan empty state dan fitur hapus-selesai.

- Keputusan:
  Tidak ada fitur baru pada tahap ini. Fokus pada verifikasi akhir dan penyusunan dokumentasi (screenshot + proposal lengkap).

- Alasan:
  Memastikan hasil akhir stabil sebelum masuk ke tahap dokumentasi, sehingga proposal yang ditulis mencerminkan kondisi aplikasi yang benar-benar diuji, bukan asumsi.

- Bukti:
  Seluruh screenshot pengujian tersimpan di `screenshots/testing/` (`01` sampai `08b`).
