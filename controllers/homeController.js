const Product = require('../models/product');

class HomeController {
  static async index(req, res) {
    try {
      const products = await Product.getAll();
      res.render('pages/index', {
        title: 'Dashboard - Admin Toko',
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

module.exports = HomeController;
