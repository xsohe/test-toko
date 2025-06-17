const db = require('../config/database');

class Stock {
  static updateStock(productId, quantity) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE stock_produk 
        SET jumlah = jumlah - ?, updated_at = CURRENT_TIMESTAMP 
        WHERE produk_id = ?
      `;

      db.getDatabase().run(query, [quantity, productId], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static restoreStock(productId, quantity) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE stock_produk 
        SET jumlah = jumlah + ?, updated_at = CURRENT_TIMESTAMP 
        WHERE produk_id = ?
      `;

      db.getDatabase().run(query, [quantity, productId], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
}

module.exports = Stock;
