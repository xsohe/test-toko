const Product = require('../models/product');

class ProductController {
  static async index(req, res) {
    try {
      const products = await Product.getAll();
      res.render('pages/products', {
        title: 'Daftar Produk',
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
}

module.exports = ProductController;
