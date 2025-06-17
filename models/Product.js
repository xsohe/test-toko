const db = require('../config/database');

class Product {
  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, s.jumlah as stock 
        FROM produk p 
        LEFT JOIN stock_produk s ON p.id = s.produk_id
        ORDER BY p.nama
      `;

      db.getDatabase().all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, s.jumlah as stock 
        FROM produk p 
        LEFT JOIN stock_produk s ON p.id = s.produk_id 
        WHERE p.id = ?
      `;

      db.getDatabase().get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getAvailableProducts() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, s.jumlah as stock 
        FROM produk p 
        LEFT JOIN stock_produk s ON p.id = s.produk_id
        WHERE s.jumlah > 0
        ORDER BY p.nama
      `;

      db.getDatabase().all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Product;
