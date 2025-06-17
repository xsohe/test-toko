const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '..', 'store.db'));

const products = [
  ['Laptop Gaming ASUS ROG', 15000000, 'Elektronik'],
  ['Mouse Wireless Logitech MX', 350000, 'Aksesoris'],
  ['Keyboard Mechanical RGB', 750000, 'Aksesoris'],
  ['Monitor 24 inch Samsung', 2500000, 'Elektronik'],
  ['Headset Gaming HyperX', 450000, 'Aksesoris'],
  ['Webcam HD Logitech', 650000, 'Elektronik'],
  ['Speaker Bluetooth JBL', 300000, 'Audio'],
  ['Hard Drive External 1TB', 850000, 'Storage'],
  ['RAM DDR4 16GB Corsair', 1200000, 'Komponen'],
  ['SSD 512GB Samsung', 950000, 'Storage'],
];

console.log('Seeding database...');

db.serialize(() => {
  db.run('DELETE FROM pembelian');
  db.run('DELETE FROM stock_produk');
  db.run('DELETE FROM produk', [], function (err) {
    if (err) throw err;

    const stmt = db.prepare('INSERT INTO produk (nama, harga, kategori) VALUES (?, ?, ?)');
    products.forEach((product) => {
      stmt.run(product);
    });
    stmt.finalize((err) => {
      if (err) throw err;

      db.run(
        `INSERT INTO stock_produk (produk_id, jumlah) 
                SELECT id, 
                       CASE 
                           WHEN id % 3 = 0 THEN 5
                           WHEN id % 3 = 1 THEN 25
                           ELSE 50
                       END
                FROM produk`,
        [],
        (err) => {
          if (err) throw err;
          console.log('Database seeded successfully!');
          db.close();
        }
      );
    });
  });
});
