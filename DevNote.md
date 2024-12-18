# Yang Masih perlu ditanyakan / ragu :

- [Ragu] Data Supplier / Customer bisa punya no rekening dan nama bank yang sama atau tidak?
  (pengaruh ke bagian validasi no_rek dan nama_bank hrs unik pada tiap supplier)

- [Ragu] kode_nota apakah dikasi pengecekan unique karena formatnya aneh2 dan kemungkinan bisa kembar (?) (sudah dikasi tapi tanyakan pasti unique atau nda)

- Jangan Lupa tambahin ke Supplier dto semua field harus diisi (done di bagian update)

- tambah deleted_at is null pada findAll func di semua repo (cek terutama yang filter e ada $in e)

# Alur fitur proyek

- table yang terlibat yaitu karyawan, team, proyek, proyek_produk, produk

* table karyawan

- Create, update, delete karyawan (done)
- Find All dan Find One karyawan (done)

* table proyek

- Create, update, delete proyek (done)
- Find All dan Find One proyek (done)

* table produk

- create produk
  Request: nama
- update produk
  Request: nama detail product(array)
- delete produk
- find one produk by id (return produk + detail produk)

* table team

* table proyek produk
