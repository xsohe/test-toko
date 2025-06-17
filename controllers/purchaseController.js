const Purchase = require('../models/purchase');
const Product = require('../models/product');
const Stock = require('../models/stock');

class PurchaseController {
  static async index(req, res) {
    try {
      const purchases = await Purchase.getAll();
      res.render('pages/purchases', {
        title: 'Daftar Pembelian',
        purchases,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Gagal memuat data pembelian',
      });
    }
  }

  static async create(req, res) {
    try {
      const products = await Product.getAvailableProducts();
      res.render('pages/create-purchase', {
        title: 'Buat Pembelian Baru',
        products,
      });
    } catch (error) {
      console.error(error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Gagal memuat data produk',
      });
    }
  }

  static async store(req, res) {
    try {
      const { produk_id, jumlah } = req.body;

      // Get product info and check stock
      const product = await Product.getById(produk_id);

      if (!product) {
        return res.status(400).send('Produk tidak ditemukan');
      }

      if (product.stock < jumlah) {
        return res.status(400).send('Stock tidak mencukupi');
      }

      const totalPrice = product.harga * jumlah;

      // Create purchase
      await Purchase.create(produk_id, jumlah, totalPrice);

      // Update stock
      await Stock.updateStock(produk_id, jumlah);

      res.redirect('/purchases');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal membuat pembelian');
    }
  }

  static async cancel(req, res) {
    try {
      const purchaseId = req.params.id;

      // Get purchase info
      const purchase = await Purchase.getById(purchaseId);

      if (!purchase) {
        return res.status(400).send('Pembelian tidak ditemukan atau sudah dibatalkan');
      }

      // Cancel purchase
      await Purchase.cancel(purchaseId);

      // Restore stock
      await Stock.restoreStock(purchase.produk_id, purchase.jumlah);

      res.redirect('/purchases');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal membatalkan pembelian');
    }
  }
}

module.exports = PurchaseController;
