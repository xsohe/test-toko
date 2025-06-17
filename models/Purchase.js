const db = require('../config/database');

class Purchase {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT pm.*, p.nama as produk_nama, p.harga 
        FROM pembelian pm
        JOIN produk p ON pm.produk_id = p.id
        ORDER BY pm.created_at DESC
      `;

      db.getDatabase().all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static create(productId, quantity, totalPrice) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO pembelian (produk_id, jumlah, total_harga) 
        VALUES (?, ?, ?)
      `;

      db.getDatabase().run(query, [productId, quantity, totalPrice], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM pembelian 
        WHERE id = ? AND status = 'active'
      `;

      db.getDatabase().get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static cancel(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE pembelian 
        SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;

      db.getDatabase().run(query, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
}

module.exports = Purchase;
