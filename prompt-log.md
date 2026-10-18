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
