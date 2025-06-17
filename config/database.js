const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '..', 'store.db'));
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create tables
        this.db.run(`CREATE TABLE IF NOT EXISTS produk (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nama VARCHAR(100) NOT NULL,
          harga DECIMAL(10,2) NOT NULL,
          kategori VARCHAR(50),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        this.db.run(`CREATE TABLE IF NOT EXISTS stock_produk (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          produk_id INTEGER,
          jumlah INTEGER NOT NULL DEFAULT 0,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (produk_id) REFERENCES produk(id)
        )`);

        this.db.run(
          `CREATE TABLE IF NOT EXISTS pembelian (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          produk_id INTEGER,
          jumlah INTEGER NOT NULL,
          total_harga DECIMAL(10,2) NOT NULL,
          status VARCHAR(20) DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          cancelled_at DATETIME,
          FOREIGN KEY (produk_id) REFERENCES produk(id)
        )`,
          (err) => {
            if (err) reject(err);
            else {
              this.seedData();
              resolve();
            }
          }
        );
      });
    });
  }

  seedData() {
    const products = [
      ['Laptop Gaming ASUS', 15000000, 'Elektronik'],
      ['Mouse Wireless Logitech', 350000, 'Aksesoris'],
      ['Keyboard Mechanical', 750000, 'Aksesoris'],
      ['Monitor 24 inch Samsung', 2500000, 'Elektronik'],
      ['Headset Gaming', 450000, 'Aksesoris'],
      ['Webcam HD', 650000, 'Elektronik'],
      ['Speaker Bluetooth', 300000, 'Audio'],
      ['Hard Drive External 1TB', 850000, 'Storage'],
      ['RAM DDR4 16GB', 1200000, 'Komponen'],
      ['SSD 512GB', 950000, 'Storage'],
    ];

    const stmt = this.db.prepare('INSERT OR IGNORE INTO produk (nama, harga, kategori) VALUES (?, ?, ?)');
    products.forEach((product) => {
      stmt.run(product);
    });
    stmt.finalize();

    // Insert initial stock
    this.db.run(`INSERT OR IGNORE INTO stock_produk (produk_id, jumlah) 
                SELECT id, 50 FROM produk WHERE id NOT IN (SELECT produk_id FROM stock_produk)`);
  }

  getDatabase() {
    return this.db;
  }
}

module.exports = new Database();
